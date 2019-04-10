const Base = require('./base.js');
const ResourceRep = think.service('resourceRep');

module.exports = class extends Base {


// 获取项目下所有资源并呈现树状接口
  async getProjectSourceTreeAction() {
    let projectId = await this.ctx.ProjectId;

    let result = await ResourceRep.getSourceTree(projectId);
    return this.success(result)
  }

};
