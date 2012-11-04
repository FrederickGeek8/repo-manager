<html>
	<head>
		<title>Home | Repo Manager</title>
	</head>
	<body>
		<h1>Repo Manager</h1>
		<p><a href='add_package.php'>Add a Package</a></p>
		<p><a href='remove_package.php'>Remove a Package</a></p>
		<p><a href='settings.php'>Repo Settings</a></p>
		<hr />
		<h2>Packages</h2>
		
		<?php
			$thelist = '';
			if ($handle = opendir('.')) {
				while (false !== ($file = readdir($handle)))
				{
					if ($file != "." && $file != ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == 'deb')
					{
						$thelist .= '<li><a href="'.$file.'">'.$file.'</a></li>';
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