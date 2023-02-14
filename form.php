<?php

require './config.php';
require './DB.php';

$db_settings =
    $db = new Database\DB($dbhost, $dbuser, $dbpass, $dbname);


if (!$db) {
    echo '{"error" : "Ошибка соединения с БД"}';
    exit();
}

if ($_POST) {

    if ($_POST['event'] == 'create') {
        $query = "SELECT * FROM users WHERE first_name='" . $_POST['first-name'] . "' AND last_name='" . $_POST['last-name'] . "' AND position='" . $_POST['position'] . "'";
        $sql = $db->query($query);
        $is_user = $db->fetchAll($sql);
        if (!empty($is_user[0])) {
            echo '{"error" : "Пользователь уже существует"}';
            exit();
        }
        $query = "INSERT INTO users (first_name, last_name, position) VALUES ('" . $_POST['first-name'] . "', '" . $_POST['last-name'] . "', '" . $_POST['position'] . "')";
        $sql = $db->query($query);
        if ($sql) {
            $id = $db->lastInsertID();
            $query = "SELECT * FROM users WHERE id=" . $id;
            $sql = $db->query($query);
            $new_user = $db->fetchAll($sql);
            echo json_encode($new_user);

        } else {
            echo 0;
        }
        exit();
    }

    if ($_POST['event'] == 'getAllUsers') {
        $query = "SELECT * FROM users";
        $sql = $db->query($query);
        $users = $db->fetchAll($sql);
        echo json_encode($users);
        exit();

    }

    if ($_POST['event'] == 'removeUser') {
        $query = "DELETE FROM users WHERE id=" . $_POST["id"];
        $sql = $db->query($query);
        if ($sql) {
            echo 1;
        } else {
            echo 0;
        }
        exit();
    }

    if ($_POST['event'] == 'edit') {
        $query = "UPDATE users SET first_name='" . $_POST['first-name'] . "', last_name='" . $_POST['last-name'] . "', position='" . $_POST['position'] . "'  WHERE id=" . $_POST["user-id"];
        $sql = $db->query($query);
        if ($sql) {
            $query = "SELECT * FROM users WHERE id=" . $_POST['user-id'];
            $sql = $db->query($query);
            $update_user = $db->fetchAll($sql);
            echo json_encode($update_user);

        } else {
            echo 0;
        }
        exit();
    }

    if ($_POST['event'] == 'getAllGoodsWithAttributes') {
        $query = 'SELECT G.id, G.name as good_name, G.price as good_price, GAF.id_good, GAF.id_additional_field, AFV.id_additional_field, AFV.value as attribute_value, AF.name as attribute_name FROM goods AS G JOIN goods_additional_fields AS GAF ON GAF.id_good = G.id JOIN additional_fields_values AS AFV ON AFV.id = GAF.id_additional_field JOIN additional_fields AS AF ON AF.id = AFV.id_additional_field ORDER BY G.id  ';
        $sql = $db->query($query);
        if ($sql) {
            $goods = $db->fetchAll($sql);
            echo json_encode($goods);
        } else {
            echo 0;
        }
        exit();
    }

}