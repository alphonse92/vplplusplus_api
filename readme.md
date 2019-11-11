# VPL plus plus API 

This is the repository of VPL++ API. Its belongs to the VPL++ ecosystem.

# Requeriments 

1. Node v8 or greater
2. Babel-node not required, it will installed as dev dependency.
3. npx

# Installation

1. npm install 

# Configuration

The configuration is made by enviroment variables. However if you dont want to use enviroment variables you can choose by config file.

The folder `config/env` contains the folders that will be used by environmet. Each folder inside matchs with the environment name. For example, the folder `config/env/custom` matchs with the enviroment called `custom`.

The api will try to read the file `config.js`. 

**warning:** The `config.js` file is more relevant than the enviroment variables. Its mean, the `config.js` file overwritte the enviroment variables

## Variables

1. HOST: The domain where the api is allocated.
2. PORT: API port
3. NODE_ENV: enviroment name,
4. SYSTEM_CORES: the api will use this cores in the host cpu,
5. MONGO: mongo connection string
6. MYSQL: mysql connection string
7. MOODLE_HOST: Moodle host
8. MOODLE_PORT: Moodle port
9. MOODLE_DB_PREFIX: Moddle table prefix
10. MOODLE_AUTH_TYPE: for now, is only available 'saltedcrypt'. It is the alghoritm that moodle use to validate the user passwords
11. GOOGLE_CLIENT_ID: In order to login with gooogle, it should be the client application in your google console.
12. TOKEN_SECRET: JWT secret. Be carefull and does not exposes that.
13. TOKEN_EXP_MINUTES: It could be `NEVER` or a number. Its the time in minutes that the tokens will expires for the users sessions
14. CACHE_FOLDER: Host url for caching
15. OPEN_DEVELOPMENT_ENDPOINT: Potentially dangerous. Its exposes a development endpoint.
16. SHOW_CONFIG_AT_STARTUP: print the current configuration that the api take. Only admit true.

# Running

After you set the enviroment variables by each enviroment. You can run each enviroment running the next commands

### From scratch

Before execute the server, you can define the environment if you set the env var **NODE_ENV**

##### If you has not babel
`NODE_PATH=. node node_modules/@babel/node/bin/babel-node.js server.js`

##### If you has not babel but has npx
`NODE_PATH=. npx babel-node server.js`

##### If you has babel
`NODE_PATH=. babel-node server.js`

### Production
`npm start`

### Development
`npm startdev`

### Local
`npm startlocal`

# Endpoints

At root project, there is a exported Postman collections.

# Glosary

1. Project: project is related to a single vpl activity. It could contains several JUnit test clases.
2. Test: Test is a single JUnit test class. It has contains one o more test cases.
3. Test Case: Test case is a single JUnit method that evaluate something in a Test. 
4. Summary: Is the result when the VPL ++ Runner in VPl Jail test a single test case.
5. Runner: the runner is a wrapper of JUnit. This sotware should be installed in the Jail.


## Test

Test of vpl ++ looks like:

```java

import org.junit.Test;
import VPLPluPlusCore.Configurator;
import static org.junit.Assert.assertEquals;
import VPLPluPlusCore.annotations.VplPlusPlus;
import VPLPluPlusCore.annotations.VplTest;
import VPLPluPlusCore.annotations.VplTestCase;
import org.junit.Before;

@VplPlusPlus
@VplTest(   project = "5dbde95c22b5259ca46f359d")
public class CalculadoraTest{

  private Calculadora test;

  @Before
  public void setUp(){
    test = new Calculadora();
  }

  //  This method is a vpl test case b/c it has the VplTestCase annotation
  @VplTestCase(
    // the id links this method with a test case in database
    id = "5dbde95d22b5259ca46f35ab"
  )
  @Test(timeout = Configurator.TIMEOUT_VERY_LONG)
  public void testInstancia(){
    new Calculadora();
  }

  @VplTestCase(id = "5dbde95d22b5259ca46f35ab")
  @Test(timeout = Configurator.TIMEOUT_VERY_LONG)
  public void testSumar(){
    assertEquals(3, test.sumar(1, 2));
  }

  @VplTestCase(id = "5dbde95d22b5259ca46f35ab")
  @Test(timeout = Configurator.TIMEOUT_VERY_LONG)
  public void testRestar(){
    assertEquals(-1, test.restar(1, 2));
  }

  @VplTestCase(id = "5dbde95d22b5259ca46f35ab")
  @Test(timeout = Configurator.TIMEOUT_VERY_LONG)
  public void testMultiplicar(){
    assertEquals(3, test.multiplicar(1, 2));
  }

  @VplTestCase(id = "5dbde95d22b5259ca46f35ab")
  @Test(timeout = Configurator.TIMEOUT_VERY_LONG)
  public void testDividir(){
    double x = test.dividir(2, 2);
    assertEquals(1,x ,0);
  }

  // the methods below arent a vpl ++ test cases
  // b/c those methods does not have the @VplTestCase annotattion
  // and will be omited by the vpl + runner
  @Test(timeout = Configurator.TIMEOUT_VERY_LONG)
  public void SingleJUnitMethod(){
    assertEquals(2, test.multiplicar(1, 2));
  }
  
  @Test(timeout = Configurator.TIMEOUT_VERY_LONG)
  public void SingleJUnitMethodThatFails(){
    assertEquals(3, test.multiplicar(1, 2));
  }

}

```

# How to calculate the student skill of a topic?
 
The skill of a student is calculated by the next formulas:

```
Effort      (E)       =  s / ∑a  
Coefficient (C)       =  ( T + 1 ) / ( R + 1 )
Skill       (S)       =  T / (E*C)
```

Variables:

```
s: Total of summaries of a test case
a: Attemps to solve a test case
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