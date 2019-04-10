module.exports = class extends think.Model {
  // async addData(param) {
    // 如果添加成功则 commit，失败则 rollback
  //   await this.startTrans();
  //   try {
  //     var projectId = await this.add(param);
  //     const resourceModel = this.model('resource').db(this.db());
  //     param.projectId = projectId;
  //     param.isAdmin = 1;
  //     await resourceModel.add(param);
  //     await this.commit();
  //   } catch (e) {
  //     projectId = 0;
  //     await this.rollback();
  //   }
  //
  //   return projectId;
  // }
};
