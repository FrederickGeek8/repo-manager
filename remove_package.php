<?php
	$errors = array();

	if(isset($_GET['file'])){
		$delete = urldecode($_GET['file']);
		if(file_exists($delete)){
			if(pathinfo($delete, PATHINFO_EXTENSION) !== 'deb'){
				$errors[] = 'You are only allowed to delete deb files!';
			}
			
			if(empty($errors)){
				unlink($delete);
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
				foreach($errors as $error){
					echo '<li>'.$error.'</li>';
				}
			?>
		</ul>
		<?php
			$thelist = '';
			if ($handle = opendir('.')) {
				while (false !== ($file = readdir($handle)))
				{
					if ($file != "." && $file != ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == 'deb')
					{
						$thelist .= '<li><a href="'.$file.'">'.$file.'</a> <a style="text-decoration:none; color:grey;" href="remove_package.php?file='.urlencode($file).'">&#215;</a></li>';
					}
				}
				closedir($handle);
			}

		?>
			<ul>
			<p><?=$thelist?></p>
			</ul>
	</body>
</html>
