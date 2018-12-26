module.exports = class extends think.Logic {
  __before() {
  }
  // 获取项目下所有资源并呈现树状接口
  async getSourceTreeAction() {
    let rules = {
      projectRequestId: {
        required: true, // 字段必填
        int: true,
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
  }
}
