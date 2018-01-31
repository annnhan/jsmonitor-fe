
import sourcemapURL from 'source-map-url';

const API_PATH = process.env.apis.default.path;
const API_PROXY = `${API_PATH}/proxy`;

class SourceMap {

  constructor() {
  }

  static create() {
    return new SourceMap();
  }

  /**
   * 获取 js 中的 source map 地址
   * @returns {Promise}
   */
  getSourceMapURL(error) {
    return new Promise((resolve, reject) => {
      axios(`${API_PROXY}?u=${error.fileName}`);
    });
  }

  /**
   * 获取 sourcemap 内容
   * @param url
   */
  getSourceMap (url) {
    return axios(`${API_PROXY}?u=${url}`);
  }

  getSourceStack(error) {
    return new Promise((resolve, reject) => {
      let sourcemapUrl = null;
      let tempFile = path.resolve(server.app.dirname, `${Date.now()}.temp`);
      request
        .get(fileName)
        .on('data', (chunk) => {
          chunk = chunk.toString();
          sourcemapUrl = SourceMapURL.getFrom(chunk);
        })
        .pipe(
          fs.createWriteStream(tempFile)
            .on('close', () => {
                fs.unlink(tempFile, () => {
                });
                if (sourcemapUrl) {
                  sourcemapUrl = fileName.replace(/\/[^\/]+?$/, `/${sourcemapUrl}`);
                }
                resolve(sourcemapUrl);
              }
            ));
    });
  }
}

module.exports = SourceMap.create();

