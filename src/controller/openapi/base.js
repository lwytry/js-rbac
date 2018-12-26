module.exports = class extends think.Controller {
  constructor(ctx) {
    super(ctx);
    ctx.ProjectId = this.getProjectId(ctx);
  }
  __before() {
  }
  async getProjectId(ctx) {
    let projectRequestId = ctx.param('projectRequestId');
    let projectId = await this.cache(projectRequestId, undefined, 'redis');

    if (think.isEmpty(projectId)) {
      const ProjectRep = think.service('projectRep');
      let result = await ProjectRep.getInfoByRequestId(requestId);
      if (think.isEmpty(result.id)) {
        return this.fail(1, 'projectID error');
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
