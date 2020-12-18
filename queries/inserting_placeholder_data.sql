<?php
class InsertDataDemo{
    const DB_HOST = 'coto-1.cjlxz9e5sgts.us-west-1.rds.amazonaws.com';
  	const DB_NAME = 'Coto';
  	const DB_USER = 'admin';
  	const DB_PASSWORD = 'cfpfk5qf';

  public function __construct(){
		// open database connection
		$connectionString = sprintf("mysql:host=%s;dbname=%s",
				InsertDataDemo::DB_HOST,
				InsertDataDemo::DB_NAME);
		try {
			$this->conn = new PDO($connectionString,
					InsertDataDemo::DB_USER,
					InsertDataDemo::DB_PASSWORD);

		} catch (PDOException $pe) {
			die($pe->getMessage());
		}

  }

  public function insertSingleRow($data,$data2) {
  		$task = array(':data' => $data,':data2' => $data2);

  		$sql = "INSERT INTO test_results(part_no,test_no,final_yield,relays_tested)
  				VALUES(123,'003456',:data,:data2)";

  		$q = $this->conn->prepare($sql);

  		return $q->execute($task);
  	}


  	/**
  	 * close the database connection
  	 */
  public	function __destruct() {
  		// close the database connection
  		$this->conn = null;
  	}

}

$obj = new InsertDataDemo();

$min = 0;
$max = 5000;
for ($x = 0; $x < 900; $x++) {
	$rand = mt_rand (($min * 1000000) , ($max * 1000000)) / 1000000;
	$rand2 = mt_rand (($min * 1000000) , ($max * 1000000)) / 1000000;
	echo $rand;
	echo "  ";
	echo $rand2;
    echo nl2br("\n");
    $obj->insertSingleRow($rand,$rand2);
}
