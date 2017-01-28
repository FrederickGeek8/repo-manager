<?php
	include('core/config.php');

	$errors = array();

	if(!empty($_POST)){
		if ($_POST['password'] !== 'Ge0rgesRepoRules') {
			$errors[] = 'Please enter the correct password.';
		} else {
			if(empty($_POST['suite'])){
				$_POST['suite'] = 'stable';
			}

			if(empty($_POST['components'])){
				$_POST['components'] = 'main';
			}

			$origin = addslashes(html_entity_decode($_POST['origin']));
			$label = addslashes(html_entity_decode($_POST['label']));
			$suite = addslashes(html_entity_decode($_POST['suite']));
			$version = addslashes(html_entity_decode($_POST['version']));
			$codename = addslashes(html_entity_decode($_POST['codename']));
			$architectures = addslashes(html_entity_decode($_POST['architectures']));
			$components = addslashes(html_entity_decode($_POST['components']));
			$description = addslashes(html_entity_decode($_POST['description']));
			$config = '<?php
			$origin = \''.$origin.'\';
			$label = \''.$label.'\';
			$suite = \''.$suite.'\';
			$version = \''.$version.'\';
			$codename = \''.$codename.'\';
			$architectures = \''.$architectures.'\';
			$components = \''.$components.'\';
			$description = \''.$description.'\';
			?>';

			$origin = html_entity_decode($_POST['origin']);
			$label = html_entity_decode($_POST['label']);
			$suite = html_entity_decode($_POST['suite']);
			$version = html_entity_decode($_POST['version']);
			$codename = html_entity_decode($_POST['codename']);
			$architectures = html_entity_decode($_POST['architectures']);
			$components = html_entity_decode($_POST['components']);
			$description = html_entity_decode($_POST['description']);
			$content = "Origin: {$origin}
			Label: {$label}
			Suite: {$suite}
			Version: {$version}
			Codename: {$codename}
			Architectures: {$architectures}
			Components: {$components}
			Description: {$description}";

			$fp = fopen('core/config.php', 'w');
			fwrite($fp, $config);
			fclose($fp);

			$file = fopen('Release', 'w');
			fwrite($file, $content);
			fclose($file);
		}
	}
?>
<html>
	<head>
		<title>Settings | Repo Manager</title>
		<style type='text/css'>
			input[type=text] {
				width:300px;
			}
		</style>
	</head>
	<body>
		<header><a href='index.php'>Home</a></header>
		<h1>Repo Settings</h1>
		<h4>Note: Everything here is optional, but some will be automatically filled in if left blank.</h4>
		<ul>
			<?php
				foreach($errors as $error){
					echo '<li>'.$error.'</li>';
				}
			?>
		</ul>
		<form action='#' method="post">
			<p>
				<label for='origin'>Origin:</label>
				<input type='text' name='origin' id='origin' placeholder='Origin' <?php if(empty($origin) === false){ echo 'value="'.htmlentities(stripslashes($origin)).'"'; } ?> />
			</p>
			<p>
				<label for='label'>Label:</label>
				<input type='text' name='label' id='Label' placeholder='Label' <?php if(empty($label) === false){ echo 'value="'.htmlentities(stripslashes($label)).'"'; } ?> />
			</p>
			<p>
				<label for='suite'>Suite:</label>
				<input type='text' name='suite' id='suite' placeholder='stable' <?php if(empty($suite) === false){ echo 'value="'.htmlentities(stripslashes($suite)).'"'; } ?> />
			</p>
			<p>
				<label for='version'>Version:</label>
				<input type='text' name='version' id='version' placeholder='Version' <?php if(empty($version) === false){ echo 'value="'.htmlentities(stripslashes($version)).'"'; } ?> />
			</p>
			<p>
				<label for='codename'>Codename:</label>
				<input type='text' name='codename' id='codename' placeholder='Codename' <?php if(empty($codename) === false){ echo 'value="'.htmlentities(stripslashes($codename)).'"'; } ?> />
			</p>
			<p>
				<label for='architectures'>Architectures:</label>
				<input type='text' name='architectures' id='architectures' placeholder='Architectures' <?php if(empty($architectures) === false){ echo 'value="'.htmlentities(stripslashes($architectures)).'"'; } ?> />
			</p>
			<p>
				<label for='components'>Components:</label>
				<input type='text' name='components' id='components' placeholder="main" <?php if(empty($components) === false){ echo 'value="'.htmlentities(stripslashes($components)).'"'; } ?> />
			</p>
			<p>
				<label for='description'>Description:</label>
				<textarea rows="4" cols="50" name='description' id='description' placeholder='Description'><?php if(empty($description) === false){ echo htmlentities(stripslashes($description)); } ?></textarea>
			</p>
			<p>
				<label for="password">Password:</label>
				<input type='password' name='password' id='password'/>
			</p>
			<p>
				<input type='submit' value='Update' />
			</p>
		</form>
	</body>
</html>
