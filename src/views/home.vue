<template>
  <div class="views-home">
    <c-title :text="title"></c-title>
    <c-header>
      <el-dropdown size="small" style="margin-right: 10px;" @command="setProject" placement="bottom-start">
          <span class="el-dropdown-link">
            {{project}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in userInfo.projects " :command="item">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown size="small" style="margin-right: 10px;" @command="setTimeRange" placement="bottom-start">
          <span class="el-dropdown-link">
            {{timeRange}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="Today">Today</el-dropdown-item>
          <el-dropdown-item command="Yesterday">Yesterday</el-dropdown-item>
          <el-dropdown-item command="Last 7 days">Last 7 days</el-dropdown-item>
          <el-dropdown-item command="Last 14 days">Last 14 days</el-dropdown-item>
          <el-dropdown-item command="Last 30 days">Last 30 days</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input size="small" style="max-width: 600px;"
                placeholder="Search query language"
                @keyup.enter.native="getData"
                v-model="query">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <span>|</span>
    </c-header>
    <div class="main" ref="main">
      <bar-chart v-if="errorList.length" :chart-data="chartData" :options="chartOptions" :height="60"></bar-chart>
      <el-table v-if="errorList.length"
                :data="errorList"
                class="list"
                :row-style="{cursor: 'pointer'}"
                :header-row-style="{background: '#f5f7fa'}"
                @row-click="showDetail"
                border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="NAME"></el-table-column>
        <el-table-column prop="message" label="MESSAGE"></el-table-column>
        <el-table-column prop="url" label="URL"></el-table-column>
        <el-table-column prop="errorType" label="TYPE"></el-table-column>
        <el-table-column prop="errorTime" label="TIME"></el-table-column>
      </el-table>
    </div>
    <div ref="style"></div>
    <c-gotop></c-gotop>
  </div>
</template>

<script>

  import moment from 'moment';
  import UAParser from 'ua-parser-js';
  import cTitle from 'components/title';
  import cHeader from 'components/header';
  import cGotop from 'components/gotop';
  import barChart from 'components/bar-chart';
  import {Input, Dropdown, DropdownMenu, DropdownItem, Table, TableColumn} from 'element-ui';
  import {mapState, mapActions} from 'vuex';

  const API_ROOT = process.env.apis.default.path;
  const API_LOGS = `${API_ROOT}/logs`;
  const oneDay = 24 * 60 * 60 * 1000;
  const dayMap = {
    'Last 7 days': 6,
    'Last 14 days': 13,
    'Last 30 days': 29,
  };


  let isLastPage = false;
  let getDataTimer = null;
  let chartColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(0, 255, 0, 0.2)',
  ];
  chartColors = chartColors.concat(chartColors);
  chartColors = chartColors.concat(chartColors);
  chartColors = chartColors.concat(chartColors);

  export default {

    data() {
      return {
        title: 'HOME',
        query: '',
        chartData: null,
        chartOptions: {
          legend: {
            display: false,
          }
        }
      }
    },

    computed: {

      ...mapState(['userInfo', 'timeRange', 'project', 'total', 'pageNumber', 'pageSize', 'errorList',]),

      fullQuery() {
        return `projectName:${this.project}${this.query ? ' AND ' : ''}${this.query}`;
      },

    },

    watch: {},

    methods: {

      ...mapActions(['logout']),

      // 计算 chart 数据
      setChartData() {
        let labels = [];
        let data = [];
        let countMap = {};
        let formatString = 'YYYY-MM-DD';

        if (this.timeRange == 'Today' || this.timeRange == 'Yesterday') {
          formatString = 'HH';
          labels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        }
        else {
          let maxTime = Date.now();
          let day = dayMap[this.timeRange];
          while (day >= 0) {
            labels.push(moment(maxTime - oneDay * day).format('YYYY-MM-DD'));
            --day;
          }
        }

        this.errorList.forEach(item => {
          const date = item.moment.format(formatString);
          countMap[date] = countMap[date] ? countMap[date] + 1 : 1;
        });

        labels.forEach((item, index) => {
          data[index] = countMap[item] || 0;
        });

        this.chartData = {
          labels,
          datasets: [{
            label: '',
            backgroundColor: chartColors,
            data
          }]
        }
      },

      // 更换项目
      setProject(project) {
        this.$store.commit('project', project || this.userInfo.projects[0]);
        this.getData();
      },

      // 选时间范围
      setTimeRange(timeRange) {
        this.$store.commit('timeRange', timeRange);
        this.getData();
      },

      // 解析起始时间
      parseTimeRange() {
        let endTime = moment();
        let startTime = moment().startOf('day');
        if (this.timeRange != 'Today') {
          if (this.timeRange == 'Yesterday') {
            endTime = endTime.startOf('day').subtract(1, 'seconds');
            ;
            startTime = startTime.subtract(1, 'days');
          }
          else {
            startTime = startTime.subtract(dayMap[this.timeRange], 'days');
          }
        }
        return {startTime: startTime.toJSON(), endTime: endTime.toJSON()};
      },

      // 获取错误数据 @param append 是否查询下一页
      getData(append) {
        if (isLastPage && append) {
          return;
        }
        clearTimeout(getDataTimer);
        getDataTimer = setTimeout(() => {
          this.$store.commit('query', this.query);
          let time = this.parseTimeRange();
          axios(API_LOGS, {
            params: {
              ...time,
              pageNumber: append ? parseInt(this.pageNumber, 10) + 1 : 1,
              pageSize: this.pageSize,
              query: this.fullQuery,
            },
          }).then(result => {
            let list = result.value.list;
            let length = list.length;
            list.forEach(item => {
              item.moment = moment(item.timestamp);
              item.errorTime = item.moment.format('YYYY-MM-DD HH:mm:ss');
              item.userAgent = UAParser(item.userAgent);
              append && this.errorList.push(item);
            });

            isLastPage = length < this.pageSize;
            !append && this.$store.commit('errorList', list);
            length > 0 && this.$store.commit('pageNumber', result.value.pageNumber);
            this.setChartData();
          });
        }, 300);
      },

      // 获取下一页数据
      getNextPageData() {
        if (window.scrollY + window.innerHeight == document.body.offsetHeight) {
          this.getData(true);
        }
      },

      //跳到详情页
      showDetail(detail, event, column) {
        this.$store.commit('errorDetail', detail);
        this.$router.push({
          name: 'Detail', query: {
            _id: detail._id
          }
        });
      },
    },

    created() {
      this.setProject();
      this.query = this.$store.state.query;
      window.addEventListener('scroll', this.getNextPageData);
    },


    destroyed() {
      window.removeEventListener('scroll', this.getNextPageData);
    },

    mounted() {
      this.$refs.style.innerHTML = `
        <style>
          .views-home header .search .el-input__inner {
            border-radius: 16px;
          }
        </style>
      `;
      this.getData();
    },

    components: {
      cTitle,
      cHeader,
      cGotop,
      barChart,
      [Input.name]: Input,
      [Dropdown.name]: Dropdown,
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/css/variable";

  .el-dropdown-menu {
    transform: translateY(-20px);
  }

  .views-home {
    padding: 60px 20px 20px 20px;
    .list {
      width: 100%;
      margin-top: 10px;
    }
  }
</style>
