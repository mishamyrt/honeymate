<?php
sleep($_GET['sleep']);
header('Content-Type: image/jpeg');
readfile($_GET['img']);