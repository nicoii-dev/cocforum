<?php

$server = "localhost";
$user = "root";
$pass = "";
$dbname = "forum_db";

$conn = mysqli_connect($server, $user, $pass, $dbname);


$op = $_GET['op'];
switch($op){
    case '':listdata();break;
    default:listdata();break;
    case 'register':register();break;
    case 'login':login();break;
    case 'getuser':getuser();break;
    case 'updateuser':updateuser();break;
    case 'create':create();break;
    case 'thread':thread();break;
    case 'updatethread':updatethread();break;
    case 'deletethread':deletethread();break;
    case 'getcomments':getcomments();break;
    case 'comments':comments();break;
    case 'updatecomment':updatecomment();break;
    case 'deletecomment':deletecomment();break;
}

function register(){
    global $conn;
    $fullname = $_POST['fullname'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $response = '';
    $sql_email = "SELECT * FROM user_tbl WHERE email = '$email'";
    $res_email = $conn->query($sql_email);
    if($res_email->num_rows > 0){
    	$response = "Email is already taken";
    }else{
    	if($fullname and $password){
		    $sql2 = "INSERT INTO user_tbl(fullname,email,password) VALUES ('$fullname','$email','$password')";
		    $res = mysqli_query($conn,$sql2);
		    if($res){
		    	$response = "Registration is Successful";
		    }else{
		    	$response = "Registration failed";
		    }

		  
	    }
    }
     	 $data['data'] = $response;
		echo json_encode($data);
}

function login(){
	global $conn;
	$email = $_POST['email'];
    $password = $_POST['password'];
    $response = "Email or Password is incorrect";
    $sql = "SELECT * FROM user_tbl WHERE email = '$email'";
    $result = $conn->query($sql);
	$row = $result->fetch_assoc();
        if($password == $row["password"]){
           $response = $row["user_id"];
        }else{
           $response = 0;
           }
   	$data['data'] = $response;
    echo json_encode($data);

}

function getuser(){
	global $conn;
	$user_id = $_GET['user_id'];
	$sql = "SELECT * from user_tbl WHERE user_id = '$user_id'";
	$res = $conn->query($sql);
	while($row = $res->fetch_assoc()){
			$rows[] = $row;	
	}
	//encode to json format
	$jsonData = json_encode($rows);
	echo($jsonData);
}

function updateuser(){
	global $conn;
	$user_id = $_GET['user_id'];
	$password = $_GET['password'];
	$response = "Something went wrong.";
	if($user_id and $password){
		$sql = "UPDATE user_tbl SET password = '$password' WHERE user_id = '$user_id'";
		if($conn->query($sql) == TRUE){
			$response = "Updated successfully";
		}
	}
	$data['data'] = $response;
    echo json_encode($data);	
}

function listdata(){
	global $conn;
	$sql = "SELECT * from thread_tbl ORDER by thread_id DESC";
	$res = $conn->query($sql);
	while($row = $res->fetch_assoc()){
			$rows[] = $row;	
	}
	//encode to json format
	$jsonData = json_encode($rows);
	echo($jsonData);
}

function create(){
    global $conn;
    $title = $_POST['title'];
    $thread = $_POST['thread'];
    $user_id = $_POST['user_id'];
    $response = "Adding thread failed";
    if($title and $thread and $user_id){
        $sql = "INSERT INTO thread_tbl(title, thread, user_id) VALUES ('$title','$thread','$user_id')";
        $res = mysqli_query($conn,$sql);
        if($res){
            $response = "Posted successfully";
        }
    }
    $data['data'] = $response;
    echo json_encode($data);
}

function thread(){
	global $conn;
	$thread_id = $_GET['thread_id'];
	$sql = "SELECT * FROM thread_tbl, user_tbl WHERE thread_tbl.thread_id = '$thread_id' 
									AND thread_tbl.user_id = user_tbl.user_id";
	$res = $conn->query($sql);
	if($res->num_rows > 0){
		//append each row to the array
		while($row = $res->fetch_assoc()){
				$rows[] = $row;	
		}
		//encode to json format
		$jsonData = json_encode($rows);
		echo($jsonData);
	}else{}
}

function updatethread(){
	global $conn;
	$thread_id = $_GET['thread_id'];
	$title = $_POST['title'];
	$thread = $_POST['thread'];
	$response = "Something went wrong.";
	if($title and $thread){
		$sql = "UPDATE thread_tbl SET title = '$title', thread='$thread' WHERE thread_id = '$thread_id'";
		if($conn->query($sql) == TRUE){
			$response = "Updated successfully";
		}
	}
	$data['data'] = $response;
    echo json_encode($data);	
}

function deletethread(){
	global $conn;
	$thread_id = $_GET['thread_id'];		
	$response = "Something went wrong.";
	if($thread_id){
		$sql = "DELETE FROM thread_tbl WHERE thread_id ='$thread_id'";
		if($conn->query($sql) == TRUE){
			$response = "Deleted successfully";
		}
	}
	$data['data'] = $response;
    echo json_encode($data);
}

function getcomments(){
	global $conn;
	$thread_id = $_GET['thread_id'];
	$sql = "SELECT * FROM comment_tbl, user_tbl WHERE comment_tbl.thread_id = '$thread_id' 
									AND comment_tbl.user_id = user_tbl.user_id ";
	$res = $conn->query($sql);
	if($res->num_rows > 0){
		//append each row to the array
		while($row = $res->fetch_assoc()){
				$rows[] = $row;	
		}
		//encode to json format
		$jsonData = json_encode($rows);
		echo($jsonData);
	}else{
		$jsonData['data'] = "empty";
		echo json_encode($jsonData);
	}	
}

function comments(){
    global $conn;
    $comment = $_POST['comment'];
    $thread_id = $_POST['thread_id'];
    $user_id = $_POST['user_id'];
    $response = "Adding thread failed";
    if($comment and $thread_id and $user_id){
        $sql = "INSERT INTO comment_tbl(thread_id, user_id, comment) VALUES ('$thread_id','$user_id','$comment')";
        $res = mysqli_query($conn,$sql);
        if($res){
            $response = "Posted successfully";
        }
    }
    $data['data'] = $response;
    echo json_encode($data);
}

function updatecomment(){
	global $conn;
	$comment_id = $_GET['comment_id'];
	$comment = $_GET['comment'];
	$sql = "UPDATE comment_tbl SET comment='$comment' WHERE comment_id = '$comment_id'";
        if($conn->query($sql) == TRUE){
			echo "1";
        }else{
            echo "0";
        }
}

function deletecomment(){
	global $conn;
	$comment_id = $_GET['comment_id'];		
	$sql = "DELETE FROM comment_tbl WHERE comment_id ='$comment_id'";
	if($conn->query($sql) == TRUE){
		echo "1";
	}else{
		echo "2";
	}
}
?>
