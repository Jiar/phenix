CREATE TABLE `article` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `title` VARCHAR(255) DEFAULT NULL COMMENT '文章标题',
  `content` TEXT DEFAULT NULL COMMENT '文章内容',
  `publish` INT NOT NULL DEFAULT '0' COMMENT '是否公开，0不公开，1公开',
  `categoryId` BIGINT DEFAULT NULL COMMENT '分类ID',
  `createTime` BIGINT(20) DEFAULT NULL COMMENT '创建时间',
  `updateTime` BIGINT(20) DEFAULT NULL COMMENT '修改时间',
  `status` INT NOT NULL DEFAULT 1 COMMENT '文章状态, 0:回车站 1:正常',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章表';


CREATE TABLE `category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(255) DEFAULT NULL COMMENT '分类名称',
  `createTime` BIGINT(20) DEFAULT NULL COMMENT '创建时间',
  `updateTime` BIGINT(20) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章分类表';


CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(25) NOT NULL COMMENT '用户名',
  `email` VARCHAR(128) NOT NULL COMMENT '邮箱地址',
  `password` VARCHAR(128) NOT NULL COMMENT '用户密码',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '用户头像',
  `createTime` BIGINT(20) DEFAULT NULL COMMENT '创建时间',
  `updateTime` BIGINT(20) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';