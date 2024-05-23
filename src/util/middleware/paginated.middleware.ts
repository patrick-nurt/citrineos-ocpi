import {KoaMiddlewareInterface, Middleware,} from 'routing-controllers';
import {Context} from 'vm';
import {Service} from 'typedi';
import {BaseMiddleware} from "./base.middleware";
import {DEFAULT_LIMIT, DEFAULT_OFFSET, PaginatedResponse} from "../../model/PaginatedResponse";
import {OcpiHttpHeader} from "../ocpi.http.header";

@Middleware({type: 'before'})
@Service()
export class PaginatedMiddleware extends BaseMiddleware implements KoaMiddlewareInterface {

  async use(
    context: Context,
    next: (err?: any) => Promise<any>,
  ): Promise<any> {
    await next();
    const paginatedResponse = context.response.body as PaginatedResponse<any>;
    const link = this.createLink(context, paginatedResponse);
    if (link) {
      context.response.set(OcpiHttpHeader.Link, link);
    }
    context.response.set(OcpiHttpHeader.XTotalCount, paginatedResponse.total);
    context.response.set(OcpiHttpHeader.XLimit, paginatedResponse.limit);
    delete paginatedResponse.limit;
    delete paginatedResponse.offset;
    delete paginatedResponse.total;
  }

  private createLink(context: Context, paginatedResponse: PaginatedResponse<any>) {
    const url = new URL(`${context.request.protocol}://${context.request.host}${context.request.url}`);
    const currentOffset = paginatedResponse.offset || DEFAULT_OFFSET;
    const limit = paginatedResponse.limit || DEFAULT_LIMIT;
    const total = paginatedResponse.total || 0;
    if (currentOffset + limit < total) {
      const newOffset = currentOffset + limit;
      url.searchParams.set('offset', newOffset.toString());
      return url.href;
    }
    return undefined;
  }
}
