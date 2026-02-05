<?php

namespace ContatoSeguro\Classes\Util;

const ALLOWED_PARAMS = array(
  "user" => ["name", "email", "telephone", "birth_date", "birth_city", "companies"],
  "company" => ["name", "cnpj", "id_adress", "adress"],
  "adress" => ["cep", "country", "state", "city", "street", "number", "district", "additional"]
);

class ValidateArgs
{
    public static function validateId($id)
    {

        if(isset($id) && gettype($id) === 'integer' || isset($id) && gettype($id) === 'string' && intval($id) !== 0) {
            $isValid = true;
        } else {
            $isValid = false;
        }

        return $isValid;

    }

    public static function validateBody($type, $body, $obligatoryParams = null)
    {

        if(sizeof(array_intersect($obligatoryParams, array_keys($body))) === sizeof($obligatoryParams) || $obligatoryParams === null) {

            foreach($body as $key => $value) {
                if(!in_array($key, ALLOWED_PARAMS[$type])) {
                    return false;
                }
            }

            $isValid = true;
        } else {
            $isValid = false;
        }

        return $isValid;

    }

}
