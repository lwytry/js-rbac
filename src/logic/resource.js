module.exports = class extends think.Logic {
  __before() {
  }
  async addAction() {
    let rules = {
      name: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
      label: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
      icon: {
        string: true,       // 字段类型为 String 类型
        length: {max: 20}, //长度不能大于2
      },
      addr: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 128}, //长度不能大于2
      },
      type: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 10}, //长度不能大于2
      },
      pId: {
        int: true,     // 字段必填
      },
      projectId: {
        int: true,     // 字段必填
        required: true,     // 字段必填
      },
      sort: {
        int: true,     // 字段必填
      },
      display: {
        required: true,     // 字段必填
        int: {min: 0, max: 1},     // 字段必填
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
      label: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
      icon: {
        string: true,       // 字段类型为 String 类型
        length: {max: 20}, //长度不能大于2
      },
      addr: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 128}, //长度不能大于2
      },
      type: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 10}, //长度不能大于2
      },
      pId: {
        int: true,     // 字段必填
      },
      id: {
        int: true,     // 字段必填
      },
      sort: {
        int: true,     // 字段必填
      },
      display: {
        required: true,     // 字段必填
        int: {min: 0, max: 1},     // 字段必填
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
    }
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
}
