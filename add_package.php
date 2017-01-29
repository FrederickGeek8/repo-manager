<?php

$errors = array();

$path = dirname(__FILE__);

if(isset($_FILES['file'])){
	if(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION) !== 'deb'){
		$errors[] = 'Please upload a valid .deb file!';
	}

	if ($_POST['password'] !== 'Ge0rgesRepoRules') {
		$errors[] = 'Please enter the correct password.';
	}

	if(empty($errors)){
		move_uploaded_file($_FILES["file"]["tmp_name"], "{$path}/{$_FILES["file"]["name"]}");
		exec('rm Packages.bz2');
		exec('dpkg-scanpackages -m . /dev/null >Packages');
		exec('bzip2 Packages');
	}
}
?>
<html>
	<head>
		<title>New Package | Repo Manager</title>
	</head>
	<body>
		<header><a href='index.php'>Home</a></header>
		<ul>
			<?php
				foreach($errors as $error){
					echo '<li>'.$error.'</li>';
				}
			?>
		</ul>
		<?php
			if(isset($_FILES['file'])) {
				 if(empty($errors)) {
						echo '<p>Success</p>';
				 }
			 }
		?>
		<h1>Uploading a New Packages</h1>
		<h2>Please select a file.</h2>
		<form action='#' method="post" enctype="multipart/form-data">
			<p>
				<label for="file">Filename:</label>
				<input type="file" name="file" id="file" />
			<p>
				<label for="password">Password:</label>
				<input type='password' name='password' id="password"/>
			<p>
				<input type='submit' value='Upload Package'/>
			</p>
		</form>
	</body>
</html>
