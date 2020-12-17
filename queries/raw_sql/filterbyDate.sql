CREATE DEFINER=`admin`@`%` PROCEDURE `filterbyDate`(IN minDate timestamp, IN maxDate timestamp)
BEGIN
	SELECT *
	FROM test_description 	
		INNER JOIN test_results ON test_description.dut_no=test_results.dut_no
		INNER JOIN actuate_time ON test_description.dut_no=actuate_time.dut_no
        INNER JOIN coil_resistance ON test_description.dut_no=coil_resistance.dut_no
        INNER JOIN crs ON test_description.dut_no=crs.dut_no
        INNER JOIN dcr ON test_description.dut_no=dcr.dut_no
        INNER JOIN dcrpk ON test_description.dut_no=dcrpk.dut_no
        INNER JOIN diode ON test_description.dut_no=diode.dut_no
        INNER JOIN form_b_over ON test_description.dut_no=form_b_over.dut_no
        INNER JOIN ir ON test_description.dut_no=ir.dut_no
        INNER JOIN kelvin ON test_description.dut_no=kelvin.dut_no
        INNER JOIN operate_current ON test_description.dut_no=operate_current.dut_no
        INNER JOIN operate_time ON test_description.dut_no=operate_time.dut_no
        INNER JOIN operate_voltage ON test_description.dut_no=operate_voltage.dut_no
        INNER JOIN ovd ON test_description.dut_no=ovd.dut_no
        INNER JOIN ovrvr ON test_description.dut_no=ovrvr.dut_no
        INNER JOIN release_current ON test_description.dut_no=release_current.dut_no
        INNER JOIN release_time ON test_description.dut_no=release_time.dut_no
        INNER JOIN release_voltage ON test_description.dut_no=release_voltage.dut_no
        INNER JOIN scr ON test_description.dut_no=scr.dut_no
        INNER JOIN shorts ON test_description.dut_no=shorts.dut_no
        INNER JOIN transfer_time ON test_description.dut_no=transfer_time.dut_no

		WHERE test_description.date_time BETWEEN minDate AND maxDate;

END