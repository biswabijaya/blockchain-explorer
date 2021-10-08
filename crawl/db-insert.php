<?php
    
    $file="./historical/today.json";

    $db = new SQLite3('today.db');
    $table="toptokens";
    $rows = json_decode(file_get_contents($file));

    insertData($db,$table,$rows);

    function insertData($db,$table,$rows){

        //check if table is created in db with the schema
        foreach ($rows as $row=>$rowData) {
            $columns = "";
            foreach ($rowData as $key=>$value) {
                if($key=="symbol")
                    $columns.=$key.' VARCHAR(255) NOT NULL UNIQUE,';
                else
                    $columns.=$key.' VARCHAR(255) NOT NULL,';
            } $columns=rtrim($columns, ",");
            $db->exec("CREATE TABLE IF NOT EXISTS ".$table." (".$columns.")") or die(print_r($db->errorInfo(), true));
            break;
        }

        //insert rows
        foreach ($rows as $row=>$rowData) {
            $keys = "";
            $values = "";
            foreach ($rowData as $key=>$value) {
                $keys.=$key.",";
                $values.='"'.addslashes(str_replace('"',"'",$value)).'",';
            }
            $keys=rtrim($keys, ",");
            $values=rtrim($values, ",");
            // echo "INSERT OR REPLACE INTO ".$table." (".$keys.") VALUES (".$values.")"."<br>";
            $db->exec("INSERT OR REPLACE INTO ".$table." (".$keys.") VALUES (".$values.")") or die(print_r($db->errorInfo(), true));
        }
    }
?>