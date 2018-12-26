module.exports = class extends think.Controller {
  constructor(ctx) {
    super(ctx);
    ctx.ProjectId = this.getProjectId();
  }
  __before() {
  }
  async getProjectId() {
    let projectRequestId = this.get('projectRequestId');
    if (think.isEmpty(projectRequestId)) {
      projectRequestId = this.post('projectRequestId');
    }
    if (think.isEmpty(projectRequestId)) {
      return this.fail(1, 'param invalid');
    }
    let projectId = await this.cache(projectRequestId, undefined, 'redis');

    if (think.isEmpty(projectId)) {
      const ProjectRep = think.service('projectRep');
      let result = await ProjectRep.getInfoByRequestId(requestId);
      if (think.isEmpty(result.id)) {
        return this.fail(2, 'projectID error');
      }
      projectId = result.id;
      await this.cache(requestId, result.id, {
        type: 'redis',
        redis: {
          timeout: 24 * 60 * 60 * 1000
        }
      });
    }

    return projectId;
  }
};
