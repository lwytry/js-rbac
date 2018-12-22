const ProjectRep = think.service('projectRep');
module.exports = class extends think.Logic {
  async addAction() {
    let rules = {
      name: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1001 , 'name 不能为空');
    }
    let createdAt = this.getDate();
    let name = this.post('name');
    const param = {
      name: name,
      craetedAt: createdAt,
      updatedAt: createdAt
    }
    let result = await ProjectRep.craete(param);
    if (result == 0) {
      return this.fail(1, "添加失败")
    }
    return this.success(result);
  }

  async getListAction() {
    let page = think.isEmpty(this.get('page')) ? 1 : this.get('page');
    let num = think.isEmpty(this.get('num')) ? 10 : this.get('num');
    const param = {
      page: page,
      num: num,
      name: this.get('name')
    }
    let list = await ProjectRep.getList(param);
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
      return this.fail(1001 , 'id 不能为空');
    }
    let id = this.get('id')

    let result = await ProjectRep.getInfo(id);
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
        required: true,     // 字段必填
        length: {max: 20}, //长度不能大于2
      },
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(1001 , '参数错误');
    }
    let name = this.post('name');
    let id = this.post('id');
    const param = {
      id: id,
      name: name
    }
    let result = await ProjectRep.update(param);
    return this.success(result)
  }
  async disableAction() {
    let id = this.post('id')
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await ProjectRep.disable(id);
    return this.success(result);
  }
  async enableAction() {
    let id = this.post('id');
    if (think.isEmpty(id)) {
      return this.fail(1, 'invalid param');
    }
    let result = await ProjectRep.enable(id);
    return this.success(result);
  }

  // async getChildAction() {
  //   let rules = {
  //     id: {
  //       int: true,       // 字段类型为 String 类型
  //       required: true,     // 字段必填
  //     },
  //   }
  //   let flag = this.validate(rules);
  //   if(!flag){
  //     return this.fail(1 , '参数错误');
  //   }
  //   let id = this.get('id');
  //   let model = think.model('resource');
  //   let ret = await model.query("SELECT id,requestId,pId,projectId,name,label,icon,addr,type,sort,display,status,deleted FROM  permission_resource WHERE FIND_IN_SET(id,queryChildrenAreaInfo(" + id +"))");
  //   let pmsData = {}
  //   ret.forEach((v,k)=>{
  //     console.log(v)
  //   })
  //   return this.success(ret);
  // }

  // 资源列表所需项目列表
  async getProjectListAction() {
    const param = {
      page: 1,
      num: 10,
      name: this.get('name')
    }
    let list = await ProjectRep.getProjectList(param);
    return this.success(list);
  }

};
