export default {
  sqlList : [
    `DROP TABLE IF EXISTS dp_posts;`,

    `CREATE TABLE IF NOT EXISTS  dp_posts (
      id INT(11) NOT NULL AUTO_INCREMENT,
      uuid VARCHAR(255) NOT NULL,
      user_uuid VARCHAR(255) DEFAULT NULL,
      title VARCHAR(255) DEFAULT NULL,
      content longtext DEFAULT NULL,
      created_time timestamp NOT NULL default current_timestamp,
      modified_time timestamp NOT NULL default current_timestamp,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

    `DROP TABLE IF EXISTS dp_users;`,
    
    `CREATE TABLE  IF NOT EXISTS  dp_users (
      id int(11) NOT NULL AUTO_INCREMENT,
      uuid varchar(255) NOT NULL,
      email varchar(255) DEFAULT NULL,
      password varchar(255) DEFAULT NULL,
      name varchar(255) DEFAULT NULL,
      nick varchar(255) DEFAULT NULL,
      detail_info json DEFAULT NULL,
      created_time timestamp NOT NULL default current_timestamp,
      modified_time timestamp NOT NULL default current_timestamp,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
  ]
}