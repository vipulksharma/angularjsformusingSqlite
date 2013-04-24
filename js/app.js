function FormCtrl($scope) {
	$scope.firstName = '';
	$scope.lastName = '';
	$scope.gender = 'Male';
	$scope.hobbies = [ {
		"id" : 1,
		"value" : "1",
		"label" : "Playing Games"
	}, {
		"id" : 2,
		"value" : "2",
		"label" : "Reading Books"
	}, {
		"id" : 3,
		"value" : "3",
		"label" : "Watching Movies"
	} ];
	$scope.value = [];
	$scope.updateHobbies = function(choice) {
		$scope.value = $scope.value || [];
		if (choice.checked) {
			$scope.value.push(choice.label);
		} else {
			$scope.value.splice($scope.value.indexOf(choice.label), 1);
		}
	};
	$scope.shortName = 'MyDatabase';
	$scope.version = '1.0';
	$scope.displayName = 'My Test Database Example';
	$scope.maxSizeInBytes = 65536;
	$scope.db = openDatabase($scope.shortName, $scope.version,
			$scope.displayName, $scope.maxSizeInBytes);

	$scope.insertRecords = function() {
		$scope.createTableIfNotExists();
		var hobbies = ""
		for ( var i in $scope.value) {
			hobbies += $scope.value[i] + ",";
		}
		$scope.insertsql = 'INSERT INTO Contacts (firstName, lastName, gender, hobbies) VALUES (?, ?, ?, ?)';
		if ($scope.contactForm.$valid) {
			$scope.db.transaction(function(transaction) {
				transaction.executeSql($scope.insertsql, [ $scope.firstName,
						$scope.lastName, $scope.gender, hobbies ],
						window.location.reload());
			});
		}
	};

	$scope.createTableIfNotExists = function() {
		$scope.createsql = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, gender TEXT, hobbies Text)";
		$scope.db.transaction(function(transaction) {
			transaction.executeSql($scope.createsql, []);
		});
	};

	$scope.dropTable = function() {
		$scope.dropsql = "DROP TABLE Contacts";
		$scope.db.transaction(function(transaction) {
			transaction.executeSql($scope.dropsql, [], window.location.reload());
		});
	};

	$scope.getContacts = function() {
		$scope.fetchRecords = "SELECT * from Contacts";
		$scope.db
				.transaction(function(transaction) {
					transaction.executeSql($scope.fetchRecords, [],
							$scope.showRecords);
				});
	};
	$scope.getContacts();
	$scope.showRecords = function(transaction, result) {
		$scope.tableData = [];
		for ( var i = 0; i < result.rows.length; i++) {
			$scope.tableData.push(result.rows.item(i));
		}
	};

	$scope.editContact = function(id) {
		for ( var i in $scope.tableData) {
			if ($scope.tableData[i].id == id) {
				$scope.currentId = id;
				$scope.firstName = $scope.tableData[i].firstName;
				$scope.lastName = $scope.tableData[i].lastName;
				$scope.gender = $scope.tableData[i].gender;
				var hobbies = $scope.tableData[i].hobbies.split(',');
				for ( var i in $scope.hobbies) {
					if (hobbies.indexOf($scope.hobbies[i].label) > -1) {
						$scope.hobbies[i].checked = "checked";
						$scope.value.push($scope.hobbies[i].label);
					} else {
						$scope.hobbies[i].checked = "";
					}
				}
			}
		}
	};

	$scope.updateContact = function() {
		var hobbies = ""
		for ( var i in $scope.value) {
			hobbies += $scope.value[i] + ",";
		}
		$scope.updateStatement = "UPDATE Contacts SET firstName = ?, lastName = ?, gender = ?, hobbies=? WHERE id=?";
		$scope.db.transaction(function(transaction) {
			transaction.executeSql($scope.updateStatement,
					[ $scope.firstName, $scope.lastName, $scope.gender,
							hobbies, $scope.currentId ], window.location.reload());
		});
	};

	$scope.deleteContact = function(id) {
		$scope.deleteStatement = "DELETE FROM Contacts where id=" + id;
		$scope.db.transaction(function(transaction) {
			transaction.executeSql($scope.deleteStatement, [], window.location.reload());
		});
	};
}