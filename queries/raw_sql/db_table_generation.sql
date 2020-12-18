CREATE DATABASE IF NOT EXISTS Coto2;
USE Coto2;

CREATE TABLE IF NOT EXISTS test_description (
    test_no INT AUTO_INCREMENT PRIMARY KEY,
    part_no varchar (10) NOT NULL,
    selection varchar (10) not null,
    work_order varchar (10),
    plt varchar (10) not null,
    datecode_sw varchar (10) not null,
    datecode_rel varchar (10) not null,
    test_type varchar (10) not null,
    fixture varchar (10) not null,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS test_results (
    test_no INT AUTO_INCREMENT PRIMARY KEY,
    part_no varchar (10) NOT NULL,
    final_yield float(8,4),
    relays_tested int
)  ENGINE=INNODB;
USE Coto;

CREATE TABLE IF NOT EXISTS ovd (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS diode (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS coil_resistance (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS shorts (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS kelvin (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS operate_voltage (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS release_voltage (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS scr (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS ir (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS dcr (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS operate_current (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS release_current (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS actuate_time (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS operate_time (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS crs (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS ovrvr (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS form_b_over (
	dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS release_time (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS transfer_time (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS dcrpk (
    dut_no INT AUTO_INCREMENT PRIMARY KEY,
    test_no int,
    result1 float(8,4),
    result2 float(8,4),
	result3 float(8,4),
    flag varchar(12)    
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS users (
    username varchar(12) PRIMARY KEY,
    passwords varchar(12)    
)  ENGINE=INNODB;

insert into users (username,passwords) values ("dummy","contra");
