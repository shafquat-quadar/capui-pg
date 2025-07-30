using { my.db as db } from '../db/data-model';

service CatalogService {
  entity ODataServices as projection on db.ODataServices;
}
