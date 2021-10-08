<?php

    cors();
    error_reporting(E_ERROR | E_PARSE);

    if (isset($_GET['date']) && isset($_GET['symbol'])) {
        if (is_array($_GET['symbol'])==1) {
            //init return
            $returnData = new stdClass();

            for ($i=0; $i < count($_GET['symbol']); $i++) { 
                $tokenFile = './indexed/'.$_GET['symbol'][$i].'.json';
                if (file_exists($tokenFile)) {  
                    $tokenData=json_decode(file_get_contents($tokenFile));

                    $_GET['date'][$i] = json_decode($_GET['date'][$i]);
                    
                    $history = new stdClass();

                    //loop through dates of the token
                    for ($j=0; $j < count($_GET['date'][$i]); $j++) { 
                        $history->{$_GET['date'][$i][$j]}=array(
                            "24h"=>$tokenData->history->{$_GET['date'][$i][$j]}->d ?? 0,
                            "price"=>$tokenData->history->{$_GET['date'][$i][$j]}->p ?? -1
                        );

                        if ($history->{$_GET['date'][$i][$j]}->price == -1) {
                            //if prev and next exists
                            if( isset($tokenData->history->{date("Ymd",strtotime($_GET['date'][$i][$j]. " -1 day"))}) and isset($tokenData->history->{date("Ymd",strtotime($_GET['date'][$i][$j]. " +1 day"))}) )
                                $history->{$_GET['date'][$i][$j]}->price = (($tokenData->history->{date("Ymd",strtotime($_GET['date'][$i][$j]. " -1 day"))}->p) + $tokenData->history->{date("Ymd",strtotime($_GET['date'][$i][$j]. " +1 day"))}->p)/2;
                        }
                    }

                    //if prev and next exists
                    $returnData->{$_GET['symbol'][$i]} = array(
                        "name"=>$tokenData->name,
                        "history"=>$history,
                        "datecount"=>count($_GET['date'][$i]),
                        "dates"=>$_GET['date'][$i][0]
                    );
                }
            }
            echo json_encode(array("status"=>"success","data"=>$returnData));
        } else {
            $tokenFile = './indexed/'.$_GET['symbol'].'.json';
            if (file_exists($tokenFile)) {  
                $tokenData=json_decode(file_get_contents($tokenFile));
                
                $returnData = array(
                    "name"=>$tokenData->name,
                    "symbol"=>$tokenData->symbol,
                    "24h"=>$tokenData->history->{$_GET['date']}->d ?? 0,
                    "price"=>$tokenData->history->{$_GET['date']}->p ?? -1,
                    "date"=>$_GET['date']
                );

                if ($returnData["price"] == -1) {
                $returnData["price"] = (($tokenData->history->{date("Ymd",strtotime($_GET['date']. " -1 day"))}->p) + $tokenData->history->{date("Ymd",strtotime($_GET['date']. " +1 day"))}->p)/2;
                }
                echo json_encode(array("status"=>"success","data"=>$returnData));
            } else {
                echo json_encode(array("status"=>"success","data"=>""));
            }    
        }
            
    } else {
        echo json_encode(array("status"=>"success","data"=>""));
    }  

    function cors() {
        
        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
            // you want to allow, and if so:
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }
        
        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                // may also be using PUT, PATCH, HEAD etc
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        
            exit(0);
        }
        // echo "You have CORS!";
    }
?>