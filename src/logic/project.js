module.exports = class extends think.Logic {
  __before() {
  }
  // 获取项目下所有资源并呈现树状接口
  async getSourceTreeAction() {
    let rules = {
      projectId: {
        required: true, // 字段必填
        int: true,
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
  }

  async addAction() {
    let rules = {
      name: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
  }

  async updateAction() {
    let rules = {
      name: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
      id: {
        int: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
  }

}
