-- DROP TABLE IF EXISTS dp_posts;

CREATE TABLE IF NOT EXISTS  dp_posts (
  id INT(11) NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) DEFAULT NULL,
  user_uuid VARCHAR(255) DEFAULT NULL,
  title VARCHAR(255) DEFAULT NULL,
  content longtext DEFAULT NULL,
  created_time timestamp NOT NULL default current_timestamp,
  modified_time timestamp NOT NULL default current_timestamp,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;