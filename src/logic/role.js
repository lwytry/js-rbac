module.exports = class extends think.Logic {
  __before() {
  }
  getRoleSourceAction() {
    let rules = {
      roleIds: {
        string: true,       // 字段类型为 String 类型
        trim: true,
        required: true,
      },
      isTree: {
        int: true,       // 字段类型为 Int 类型
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1 , this.validateErrors);
    }
  }

  setRoleSourceAction() {
    let rules = {
      requestId: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
      },
      roleId: {
        int: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
      },
      userId: {
        int: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1 , this.validateErrors);
    }
  }
  addAction() {
    let rules = {
      name: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        trim: true,         // 去除空格
        length: {max: 20}, //长度不能大于20
      },
      description: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        trim: true,         // 去除空格
        length: {max: 30}, //长度不能大于20
      },
    }
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(1, this.validateErrors);
    }
  }
}
