namespace my.db;

entity ODataServices {
  key ID           : UUID;
      base_url     : String(1000);
      service_name : String(255);
      metadata_raw : LargeString;
      description  : LargeString;
      active       : Boolean;
}
