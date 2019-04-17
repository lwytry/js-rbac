module.exports = class extends think.Logic {
  __before() {
  }
  async getProjectId() {
    let rules = {
      projectRequestId: {
        required: true,     // 字段必填
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
  }
}
