#Moodle Vpl Plus Plus


This api belongs to the VPl++ microservices ecosystem.
#Glosary

1. Test case: is a method of a unit test
2. Test: is a JUnit Class with test cases (methods)
3. Project: is a set of tests (JUnit classes) and is related to an moodle vpl activity

#FAQ

## How to calculate the student skill of a topic?
 The skill of a student is calculated by the next formulas:
```
Effort      (E)       =  s / ∑a  
Coefficient (C)       =  ( T + 1 ) / ( R + 1 )
Skill       (S)       =  T / (E*C)
```

Variables:
```
s: Total of summaries of a test case
a: attemp to solve a test case
T: Total of test cases  
R: Total of test cases that the student solved
N: Total of test cases that the student not solved
C: Negative coefiecent, more not solved tests, more penalization
E: The ammount of all attempts to solve a test_case 
S: Student skill level
```

Conditions:
```
1. Valid values of T : T >= R && T >= N && T > 0
2. Valid values of R : T >= R >= 0
3. Valid values of N : T >= N => 0
4. Valid values of C:  C >= 1
5. valid values of E:  E >= R => 0
6. Valid values of S:  1 >= S >= 0
```