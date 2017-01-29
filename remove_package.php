<?php
$errors = array();

if(isset($_POST['submit'])) {
	if ($_POST['password'] !== 'Ge0rgesRepoRules') {
		$errors[] = 'Please enter the correct password.';

	} else {
		foreach ($_POST['Packages'] as $delete) {
			if(file_exists($delete)) {
				if(pathinfo($delete, PATHINFO_EXTENSION) !== 'deb') {
					$errors[] = 'You are only allowed to delete deb files!';
				}

				if(empty($errors)){
					unlink($delete);
					exec('rm Packages.bz2');
					exec('dpkg-scanpackages -m . /dev/null >Packages');
					exec('bzip2 Packages');

					echo "Deleted:" .$delete;
				}
			}
		}
	}
}
?>

<html>
<head>
	<title>Remove a Package | Repo Manager</title>
</head>
<body>
	<header><a href='index.php'>Home</a></header>
	<h1>Remove a Package</h1>
	<ul>
		<?php
<<<<<<< HEAD
		foreach($errors as $error){
			echo '<li>'.$error.'</li>';
		}
		?>
	</ul>

	<?php
	$thelist = '';
	if ($handle = opendir('.')) {
		while (($file = readdir($handle)) !== false) {
			if ($file !== "." && $file !== ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == 'deb') {
				$thelist .= '<option value="'.$file.'">'.$file.'</option>';
=======
			$thelist = '';
			if ($handle = opendir('.')) {
				while (false !== ($file = readdir($handle)))
				{
					if ($file != "." && (strpos($file, '/') == false && $file != ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == 'deb')
					{
						$thelist .= '<li><a href="'.$file.'">'.$file.'</a> <a style="text-decoration:none; color:grey;" href="remove_package.php?file='.urlencode($file).'">&#215;</a></li>';
					}
				}
				closedir($handle);
>>>>>>> origin/master
			}
		}
		closedir($handle);
	}

	?>

	<form action='#' method="post" enctype="multipart/form-data">
		<p>Select packages:</p>
		<select name="Packages[]" multiple>
			<?=$thelist?>
		</select>
		<p>
			<label for="password">Password:</label>
			<input type= 'password' name='password' id='password'//>
		</p><p>
			<input type='submit' name='submit' value='Delete Packages'/>
		</p>
	</form>
</body>
</html>
