<template>
  <div class="views-detail">
    <c-title :text="title"></c-title>
    <c-header></c-header>
    <div class="main" ref="jsmain">
      <div class="left">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <strong>错误信息</strong>
            <el-switch class="switch" v-model="source" active-color="#13ce66" inactive-color="#eee"></el-switch>
            <el-input @keyup.enter.native="getSourcemapContent" @focus="abortGetSourcemapContent" v-model="sourceMapUrl"
                      class="sourcemap-url" size="small" :disabled="!source">
              <template slot="prepend">source-map:</template>
            </el-input>
          </div>
          <div class="item "><span>Name:</span><span>{{errorDetail.name}}</span></div>
          <div class="item "><span>Message:</span><span style="color: #f56c6c;">{{errorDetail.message}}</span></div>
          <template v-if="source">
            <div class="item ">
              <span>File:</span><span>{{originalFileName}}</span>
            </div>
            <div class="item "><span>Line:</span><span>{{originalLineNumber}}</span></div>
            <div class="item "><span>column:</span><span>{{originalColumnNumber}}</span></div>
            <div class="item flex">
              <span>Stack:</span>
              <div v-if="originalStack.length" class="stack-container">
                <div v-for="(item, index) in originalStack" class="stack-item">
                  <h3>at {{item.source}}:{{item.line}}:{{item.column}}</h3>
                  <pre v-highlightjs><code class="javascript">{{item.code}}</code></pre>
                  <div class="line-number">
                    <div v-for="number in item.lineNumbers" :class="{hight: number == item.line}">
                      <i class="el-icon-caret-right" v-if="number == item.line"></i>
                      {{number}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="item ">
              <span>File:</span><span><a :href="errorDetail.fileName"
                                         target="_blank">{{errorDetail.fileName}}</a></span>
            </div>
            <div class="item "><span>Line:</span><span>{{errorDetail.lineNumber}}</span></div>
            <div class="item "><span>column:</span><span>{{errorDetail.columnNumber}}</span></div>
            <div class="item flex">
              <span>Stack:</span>
              <div class="stack-container">
                <div v-for="(item, index) in errorDetail.stack" class="stack-item">
                  <h3>{{item.source}}</h3>
                  <pre v-if="index == 0 && fileErrorCode" v-html="fileErrorCode" class="online-code"></pre>
                </div>
              </div>
            </div>
          </template>
        </el-card>
      </div>
      <div class="right">
        <el-card class="card">
          <div slot="header"><strong>基本信息</strong></div>
          <div class="item"><span>Title:</span><span>{{errorDetail.title || '&nbsp;'}}</span></div>
          <div class="item"><span>URL:</span><span><a target="_blank"
                                                      :href="errorDetail.url">{{errorDetail.url}}</a></span></div>
          <div class="item"><span>Level:</span><span>{{errorDetail.errorLevel}}</span></div>
          <div class="item"><span>Type:</span><span>{{errorDetail.errorType}}</span></div>
          <div class="item"><span>Time:</span><span>{{errorDetail.errorTime}}</span></div>
        </el-card>
        <el-card class="card">
          <div slot="header"><strong>设备信息</strong></div>
          <div class="item">
            <span>Browser:</span>
            <span>{{errorDetail.userAgent.browser.name}}</span>
            <span>{{errorDetail.userAgent.browser.version}}</span>
          </div>
          <div class="item">
            <span>Engine:</span>
            <span>{{errorDetail.userAgent.engine.name}}</span>
            <span>{{errorDetail.userAgent.engine.version}}</span>
          </div>
          <div class="item">
            <span>OS:</span>
            <span>{{errorDetail.userAgent.os.name}}</span>
            <span>{{errorDetail.userAgent.os.version}}</span>
          </div>
        </el-card>
        <el-card class="card">
          <div slot="header"><strong>位置信息</strong></div>
          <div class="item "><span>City:</span><span>{{errorDetail.ip_city_name}}</span></div>
          <div class="item "><span>Country:</span><span>{{errorDetail.ip_country_code}}</span></div>
          <div class="item "><span>Geolocation:</span><span>{{errorDetail.ip_geolocation}}</span></div>
          <div class="item "><span>IP:</span><span>{{errorDetail.ip}}</span></div>
        </el-card>
        <el-card class="card">
          <div slot="header"><strong>其他信息</strong></div>
          <div class="item "><span>Project:</span><span>{{errorDetail.projectName}}</span></div>
          <div class="item "><span>ID:</span><span>{{errorDetail._id}}</span></div>
          <div class="item flex"><span>UA:</span>
            <div>{{errorDetail.userAgent.ua}}</div>
          </div>
        </el-card>
      </div>
    </div>
    <c-gotop></c-gotop>
  </div>
</template>

<script>
  import Vue from 'vue'
  import hljs from 'highlight.js'
  import cTitle from 'components/title';
  import cHeader from 'components/header';
  import cGotop from 'components/gotop';
  import {Input, Table, TableColumn, Card, Switch, Tooltip} from 'element-ui';
  import {mapState, mapActions} from 'vuex';

  const API_ROOT = process.env.apis.default.path;
  const API_LOG = `${API_ROOT}/log`;
  const API_PROXY = `${API_ROOT}/proxy`;
  let axiosCancelTokenSource = axios.CancelToken.source();
  let consumer;
  let prevSourceMapURL;

  Vue.directive('highlightjs', {
    deep: true,
    bind: function (el, binding) {
      setTimeout(()=>{
        let targets = el.querySelectorAll('code');
        targets.forEach((target) => {
          if (binding.value) {
            target.textContent = binding.value;
          }
          hljs.highlightBlock(target);
        });
      })
    },
    componentUpdated: function (el, binding) {
      setTimeout(()=>{
        let targets = el.querySelectorAll('code');
        targets.forEach((target) => {
          if (binding.value) {
            target.textContent = binding.value;
          }
          hljs.highlightBlock(target);
        });
      })
    }
  })

  sourceMap.SourceMapConsumer.initialize({
    'lib/mappings.wasm': `${location.origin}/static/sourcemap/0.7.0/mappings.wasm`
  });

  export default {

    data() {
      return {
        title: 'DETAIL',
        source: false,
        sourceMapUrl: '',
        originalFileName: '',
        originalLineNumber: '',
        originalColumnNumber: '',
        originalStack: [],
        fileContent: '',
        fileErrorCode: '',
        sourceMapContent: '',
        fileErrorCode: '',
      };
    },

    computed: {
      ...mapState(['errorDetail',]),
    },

    watch: {
      source(newValue, oldValue) {
        if (newValue && !oldValue) {
          this.getSourcemapContent();
        }
      },
    },

    methods: {

      // 截取出错代码片段（当前文件）
      getFileCode(lineNumber, columnNumber) {
        lineNumber = lineNumber || this.errorDetail.lineNumber;
        columnNumber = columnNumber || this.errorDetail.columnNumber;
        let lineList = this.fileContent.split(/\n/);
        let lineCode = lineList[lineNumber - 1];
        let columnIndex = columnNumber - 1;
        return lineCode.substring(columnIndex - 40, columnIndex + 41);
      },

      // 获取 sourcemap 内容
      getSourcemapContent: async function () {
        if (prevSourceMapURL != this.sourceMapUrl) {
          const sourceMapContent = await axios.get(`${API_PROXY}?u=${this.sourceMapUrl}`, {
            hideMessage: true,
            cancelToken: axiosCancelTokenSource.token
          });
          consumer = await new sourceMap.SourceMapConsumer(sourceMapContent);
          this.getOriginalStack();
          prevSourceMapURL = this.sourceMapUrl;
        }
      },

      // 取消获取 sourcemap 的 ajax 请求
      abortGetSourcemapContent() {
        axiosCancelTokenSource.cancel('sourcemap url will change!');
      },

      // 获取源文件的堆栈信息
      getOriginalStack() {
        this.originalStack = this.errorDetail.stack.map((item, index) => {
          const size = 5;
          const original = consumer.originalPositionFor({line: item.lineNumber, column: item.columnNumber});
          if (index == 0) {
            this.originalFileName = original.source;
            this.originalLineNumber = original.line;
            this.originalColumnNumber = original.column;
          }
          if (!original.source) {
            return false;
          }
          const sourceContent = consumer.sourceContentFor(original.source).split('\n');
          const sourceContentLine = sourceContent.length;
          let minLine = original.line - size;
          let maxLine = original.line + size;
          original.minLine = minLine < 1 ? 1 : minLine;
          original.maxLine = maxLine > sourceContentLine ? sourceContentLine : maxLine;
          original.code = sourceContent.splice(original.minLine - 1, original.maxLine - original.minLine + 1).join('\n');
          original.lineNumbers = [];
          let i = original.minLine;
          while (i <= original.maxLine) {
            original.lineNumbers.push(i);
            i++;
          }
          return original;
        }).filter((item, index) => {
          return item;
        });
      },

      // 获取异常 js 文件内容
      getFileContent() {
        axios.get(`${API_PROXY}?u=${this.errorDetail.fileName}`, {hideMessage: true,}).then(data => {
          this.fileContent = data;
          this.fileErrorCode = this.getFileCode();
        });
      },

      // 从服务端获取错误详情
      getData() {
        axios.get(`${API_LOG}?id=${this.$route.query._id}`).then(data => {
          this.$store.commit('errorDetail', data.value);
          this.sourceMapUrl = data.value.fileName + '.map';
          this.getFileContent();
        });
      },
    },

    created() {
      if (!this.errorDetail || this.errorDetail._id != this.$route.query._id) {
        this.getData();
      }
      else {
        this.sourceMapUrl = this.errorDetail.fileName + '.map';
        this.getFileContent();
      }
    },

    mounted() {
    },

    components: {
      cTitle,
      cHeader,
      cGotop,
      [Input.name]: Input,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Card.name]: Card,
      [Switch.name]: Switch,
      [Tooltip.name]: Tooltip,
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/css/variable";

  .el-dropdown-menu {
    transform: translateY(-20px);
  }

  .views-detail {
    padding: 60px 20px 20px 20px;
    .main {
      display: flex;
      .left {
        flex: 1;
        margin-right: 15px;
        overflow-x: hidden;
        min-width: 920px;
      }
      .right {
        width: 35%;
        overflow-x: hidden;
      }
      .card {
        margin-bottom: 15px;
        border-radius: 0;
        .switch {
          float: right;
        }
        .sourcemap-url {
          float: right;
          width: 70%;
          margin-right: 10px;
          border-radius: 0px;
          margin-top: -5px;
        }
        .flex {
          display: flex;
          & > div {
            flex: 1;
          }
        }
        .item {
          border-bottom: 1px solid #e6ebf5;
          &:last-child {
            border-bottom: none;
          }
          span {
            height: 48px;
            line-height: 48px;
            display: inline-block;
            color: rgb(74, 74, 74);
            &:first-child {
              color: rgb(157, 157, 161);
              width: 80px;
              padding-right: 10px;
            }
          }
        }
        .item.flex {
          div.stack-container {
            padding-top: 6px;
            padding-right: 20px;
            .stack-item {
              border-bottom: 1px dashed #eee;
              padding: 5px;
              padding-top: 0;
              position: relative;
              h3 {
                font-weight: normal;
                font-size: 14px;
                line-height: 260%;
                /*color: #f56c6c;*/
              }
              pre.online-code {
                overflow-x: auto;
                padding: 20px;
                background: #fbf1c7;
                border-radius: 7px;
                margin-bottom: 7px;
              }
              .line-number {
                box-sizing: border-box;
                width: 80px;
                border-right: 1px #ccc solid;
                position: absolute;
                left: 0;
                top: 56px;
                padding-right: 20px;
                text-align: right;
                div {
                  line-height: 150%;
                }
                .hight {
                  color: #f56c6c;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
