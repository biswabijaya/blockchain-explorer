<?php
set_time_limit(30000000000);


$files = scandir('./historical/',SCANDIR_SORT_DESCENDING);

if (!file_exists('./indexed/')) {
    mkdir('./indexed/');
}

foreach($files as $file) {

    if (count(explode('.json',$file))==2) {
        // echo $file."<hr>";
        
        $tokens = json_decode(file_get_contents('./historical/'.$file));
        $date = explode('.json',$file)[0];

        // var_dump($tokens);
        foreach($tokens as $token) { 
            $tokenFile = './indexed/'.$token->symbol.'.json';

            if(!file_exists($tokenFile)){
                $tokenDetails = array (
                    "name" => $token->name,
                    "symbol" => $token->symbol,
                    "history" => new stdClass()
                );
                //file_put_contents($tokenFile, json_encode($tokenDetails));
            } else {
                $tokenDetails = json_decode(file_get_contents($tokenFile));
            }
            if (!isset($tokenDetails->history->{$date})) {
                $tokenDetails->history->{$date}=array(
                        "c"  => str_replace(',','',explode("$",$token->marketCap)[1]),
                        "p" => str_replace(',','',explode("$",$token->price)[1]),
                        "s" => str_replace(',','',explode(" ",$token->circulationSupply)[0]),
                        "d" => (strpos($token->{"1h"}, '$') !== false) ? $token->{"7d"} :  $token->{"24h"}
                );
                
                file_put_contents($tokenFile, json_encode($tokenDetails));
            }
        }
    }
}
?>