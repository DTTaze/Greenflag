import { ApiHideProperty } from '@nestjs/swagger';

export abstract class BaseDTO {
  @ApiHideProperty()
  protected _filter?: Record<any, any>;

  public get filter(): Record<any, any> {
    this.parseFilters();

    return this._filter || {};
  }

  protected parseFilters(): void {
    return;
  }

  public addFilter(data: Record<any, any>): void {
    if (!this._filter) {
      this._filter = {};
    }

    Object.assign(this._filter, data);
  }
}
