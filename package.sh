#!/usr/bin/env bash

project_name="vue-spa-template"

rm -rf $project_name.tar.gz packageFinished $project_name

# .开头的文件会被 paas 平台忽略，无法部署到 docker
cp .babelrc babel.rc &&

# 打包 tar 用于 paas 部署
mkdir $project_name &&
cp -R build config mock src static test index.html package.json babel.rc run.sh $project_name &&
tar czf $project_name.tar.gz $project_name/* &&

rm babel.rc &&

# 生成打包成功标识
echo "ok" >> packageFinished

