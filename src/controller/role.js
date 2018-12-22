const roleRep = think.service('roleRep');

module.exports = class extends think.Logic {
  async addAction() {
    let rules = {
      name: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        trim: true,         // 去除空格
        length: {max: 20}, //长度不能大于20
      },
      projectId: {
        int: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
      },
      description: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        trim: true,         // 去除空格
        length: {max: 30}, //长度不能大于20
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1001 , this.validateErrors);
    }
    let createdAt = this.getDate();
    const param = {
      name: this.post('name'),
      projectId: this.post('projectId'),
      description: this.post('description'),
      createdAt: createdAt,
      updatedAt: createdAt
    }
    let result = await roleRep.craete(param);
    if (result == 0) {
      return this.fail(1, "名称不能重复")
    }
    return this.success(result);
  }

  async getListAction() {
    let page = think.isEmpty(this.get('page')) ? 1 : this.get('page');
    let num = think.isEmpty(this.get('num')) ? 10 : this.get('num');
    const param = {
      page: page,
      num: num,
      name: this.get('name'),
      projectId: this.get('projectId'),
    }
    let list = await roleRep.getList(param);
    return this.success(list);
  }
  async getInfoAction() {
    let rules = {
      id: {
        int: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1 , 'id 不能为空');
    }
    let id = this.get('id')

    let result = await roleRep.getInfo(id);
    return this.success(result);
  }
  async updateAction() {
    let rules = {
      id: {
        int: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
      },
      name: {
        string: true,       // 字段类型为 String 类型
        trim: true,         // 去除空格
        length: {max: 10}, //长度不能大于20
      },
      description: {
        string: true,       // 字段类型为 String 类型
        trim: true,         // 去除空格
        length: {max: 20}, //长度不能大于20
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1 , this.validateErrors);
    }
    let name = this.post('name');
    let id = this.post('id');
    const param = {
      id: id,
      name: name
    }
    let result = await roleRep.update(param);
    if (result == 0) {
      return this.fail(2, "名称不能重复或资源不存在")
    }
    return this.success(result)
  }
  async disableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await roleRep.disable(id);
    return this.success(result);
  }
  async enableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await roleRep.enable(id);
    return this.success(result);
  }

  // 获取项目所有可用资源
  async getResourceListAction() {
    const param = {
      page: 1,
      num: 10,
      name: this.get('name')
    }
    let list = await roleRep.getResourceList(param);
    return this.success(list);
  }

  // 为角色分配资源
  async setRoleSourceAction() {
    let rules = {
      roleId: {
        int: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
      },
      resourceIds: {
        string: true,       // 字段类型为 String 类型
        trim: true,
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1 , this.validateErrors);
    }
    let str = this.post('projectIds');
    let resourceIds = str.split(',');
    let roleId = this.post('roleId');
    const param = {
      roleId: roleId,
      resourceIds: resourceIds
    }
    let result = await roleRep.addRoleSource(param);
    if (result == 0) {
      return this.fail(2, "添加失败")
    }
    return this.success(result)
  }

  // 获取角色所有资源
  async getRoleSourceAction() {
    let rules = {
      roleIds: {
        string: true,       // 字段类型为 String 类型
        trim: true,
        required: true,
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1 , this.validateErrors);
    }
    let roleIds = this.get('roleIds');

    let result = await roleRep.getRoleSource(roleIds);
    if (result == 0) {
      return this.fail(2, "添加失败")
    }
    return this.success(result)
  }

};
