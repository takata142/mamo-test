/**
*psql -f initial-db.sql -Upostgres
*/

drop database if exists mamosuite;
create database mamosuite OWNER=postgres ENCODING=UTF8 TEMPLATE=template0;

\connect mamosuite;

-- notification table
drop table if exists notification;
create table if not exists notification (
    id serial,
    user_id int not null,
    notification_code int not null,
    notification_name varchar(255) not null,
    notification_date timestamp with time zone not null,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp,
    primary key(id)
    
);

insert into notification(user_id,notification_code,notification_name,notification_date,created_at,updated_at,deleted_at)
    values(1,13,'BetOutPush','2022-01-07 01:00:00',null,null,null);
insert into notification(user_id,notification_code,notification_name,notification_date,created_at,updated_at,deleted_at)
    values(1,13,'BetOutPush','2022-01-07 03:30:00',null,null,null);
insert into notification(user_id,notification_code,notification_name,notification_date,created_at,updated_at,deleted_at)
    values(1,13,'BetOutPush','2022-01-06 01:30:00',null,null,null);
insert into notification(user_id,notification_code,notification_name,notification_date,created_at,updated_at,deleted_at)
    values(3,13,'BetOutPush','2021-12-27 11:00:00',null,null,null);


-- users table
drop table if exists users;
create table if not exists users (
    id int not null,
    device_id int null,
    company_id int null,
    role_id int not null,
    email varchar(255) not null,
    -- password varchar(255) not null,
    -- vital_graoh_display tinyint not null,
    -- device_token varchar(255) null,
    -- device_arm varchar(255) null,
    -- arm_mode varchar(255) null,
    -- confirmation_token varchar(60) null,
    -- remember_token varchar(100) null,
    status varchar(20) not null,
    -- last_login datetime null,
    created_at timestamp with time zone null,
    updated_at timestamp null,
    primary key(id)
    
);

insert into users(id,device_id,company_id,role_id,email,status,created_at,updated_at)
    values(1,1,null,3,'test1@example.com','ACTIVE','2022-01-06 09:00:00',null);
insert into users(id,device_id,company_id,role_id,email,status,created_at,updated_at)
    values(2,null,null,3,'test2@example.com','ACTIVE',null,null);
insert into users(id,device_id,company_id,role_id,email,status,created_at,updated_at)
    values(3,null,null,3,'test3@example.com','ACTIVE',null,null);


-- events tabel
drop table if exists events;
create table if not exists events (
    id serial,
    user_id int not null,
    device_id int not null,
    arise_data timestamp with time zone not null,
    event_code int not null,
    created_at timestamp null,
    updated_at timestamp null,
    primary key(id)
    
);

insert into events(user_id,device_id,arise_data,event_code,created_at,updated_at)
    values(1,1,'2022-01-06 09:00:00',4,null,null);
insert into events(user_id,device_id,arise_data,event_code,created_at,updated_at)
    values(1,1,'2022-01-05 09:15:00',4,null,null);
insert into events(user_id,device_id,arise_data,event_code,created_at,updated_at)
    values(1,1,'2022-01-05 09:30:00',4,null,null);