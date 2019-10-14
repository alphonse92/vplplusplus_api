import faker from 'faker'


export const getProject = () => {

  const project = {
    "name": "Operadores aritméticos",
    "description": "Este conjunto de tests evaluará la capacidad del estudiante para usar los diferentes operadores aritméticos",
    "is_public": true,
    "activity": 4,
    "tests": [
      {
        "name": "operadores simples",
        "tags": [
          "Operadores aritméticos",
          "Fundamentos de programación"
        ],
        "description": "El estudiante deberá crear una clase calculadora con los métodos sumar,restar,dividir y multiplicar. Solo el metodo dividir retornará un double, el resto retornará valores enteros",
        "objective": "Evaluar los operadores matemáticos básicos",
        "code": "private Calculadora test \n @Before \n   public void setUp(){ \n  test = new Calculadora(); \n }",
        "test_cases": [
          {
            "name": "Crear clase",
            "objective": "Evaluar si el estudiante sabe crear la clase",
            "topic": [
              "5d39cc1ffb9370034ec5640a",
              "5d39cc1ffb9370034ec5640c"
            ],
            "grade": 2,
            "successMessage": "Felicidades, sabes usar el operador suma!",
            "successMessageLink": "http://www.google.com/search?q=how+to+make+complex+matemathics+operations+in+java",
            "failureMessage": "Buen intento, pero no has conseguido sumar dos numeros.",
            "failureMessageLink": "http://www.google.com/search?q=how+to+sum+numbers+in+java",
            "code": "Calculadora prueba = new Calculadora()"
          },
          {
            "name": "Sumar simple",
            "topic": [
              "5d39cc1ffb9370034ec5640c",
              "5d39cc1ffb9370034ec5640b"
            ],
            "objective": "Evaluar si el estudiante sabe usar el operador matemático suma",
            "grade": 2,
            "successMessage": "Felicidades, sabes usar el operador suma!",
            "successMessageLink": "http://www.google.com/search?q=how+to+make+complex+matemathics+operations+in+java",
            "failureMessage": "Buen intento, pero no has conseguido sumar dos numeros.",
            "failureMessageLink": "http://www.google.com/search?q=how+to+sum+numbers+in+java",
            "code": "assertEquals(3, test.sumar(1, 2));"
          },
          {
            "name": "Restar simple",
            "topic": [
              "5d39cc1ffb9370034ec5640c",
              "5d39cc1ffb9370034ec5640b"
            ],
            "objective": "Evaluar si el estudiante sabe usar el operador matemático suma",
            "grade": 2,
            "successMessage": "Felicidades, sabes usar el operador resta!",
            "successMessageLink": "http://www.google.com/search?q=how+to+make+complex+matemathics+operations+in+java",
            "failureMessage": "Buen intento, pero no has conseguido restar dos numeros.",
            "failureMessageLink": "http://www.google.com/search?q=how+to+diff+numbers+in+java",
            "code": "assertEquals(1, test.restar(2,1));"
          },
          {
            "name": "Multiplicar simple",
            "topic": [
              "5d39cc1ffb9370034ec5640c",
              "5d39cc1ffb9370034ec5640b"
            ],
            "objective": "Evaluar si el estudiante sabe usar el operador matemático multiplicar",
            "grade": 2,
            "successMessage": "Felicidades, sabes usar el operador multiplicar!",
            "successMessageLink": "http://www.google.com/search?q=how+to+make+complex+matemathics+operations+in+java",
            "failureMessage": "Buen intento, pero no has conseguido multiplicar dos numeros.",
            "failureMessageLink": "http://www.google.com/search?q=how+to+multiply+numbers+in+java",
            "code": "assertEquals(6, test.multiplicar(2,3));"
          },
          {
            "name": "Dividir simple",
            "topic": [
              "5d39cc1ffb9370034ec5640c",
              "5d39cc1ffb9370034ec5640b"
            ],
            "objective": "Evaluar si el estudiante sabe usar el operador matemático dividir",
            "grade": 2,
            "successMessage": "Felicidades, sabes usar el operador dividir!",
            "successMessageLink": "http://www.google.com/search?q=how+to+make+complex+matemathics+operations+in+java",
            "failureMessage": "Buen intento, pero no has conseguido dividir dos numeros. Recuerda que tu función debe retornar un double.",
            "failureMessageLink": "http://www.google.com/search?q=how+to+divide+numbers+in+java",
            "code": "assertEquals(2.5, test.dividir(5,2));"
          }
        ]
      },
      {
        "name": "operadores encadenados",
        "tags": [
          "Operadores aritméticos",
          "Fundamentos de programación"
        ],
        "description": "El estudiante deberá crear una clase calculadora con los métodos sumar,restar,dividir y multiplicar. Solo el metodo dividir retornará un double, el resto retornará valores enteros",
        "objective": "Evaluar los operadores matemáticos básicos",
        "code": "private Calculadora test \n @Before \n   public void setUp(){ \n  test = new Calculadora(); \n }",
        "test_cases": [
          {
            "name": "fuerza",
            "topic": [
              "5d39cc1ffb9370034ec5640c",
              "5d39cc1ffb9370034ec5640b",
              "5d39cc1ffb9370034ec56427"
            ],
            "objective": "Evaluar si el estudiante sabe usar los operadores matemáticos para obtener la fuerza",
            "grade": 5,
            "successMessage": "Felicidades, sabes usar los operadores matematicos para resolver obtener la fuerza",
            "successMessageLink": "http://www.google.com/search?q=how+to+make+complex+matemathics+operations+in+java",
            "failureMessage": "Buen intento, no has podido obtener la fuerza.",
            "failureMessageLink": "http://www.google.com/search?q=how+to+calculate+the+force+in+java",
            "code": "assertEquals(3, test.getFuerza(1, 2));"
          },
          {
            "name": "trabajo",
            "topic": [
              "5d39cc1ffb9370034ec5640c",
              "5d39cc1ffb9370034ec5640b",
              "5d39cc1ffb9370034ec56427"
            ],
            "objective": "Evaluar si el estudiante sabe usar los operadores matemáticos para obtener el trabajo",
            "grade": 5,
            "successMessage": "Felicidades, sabes usar los operadores matematicos para resolver obtener el trabajo",
            "successMessageLink": "http://www.google.com/search?q=how+to+make+complex+matemathics+operations+in+java",
            "failureMessage": "Buen intento, no has podido obtener el trabajo.",
            "failureMessageLink": "http://www.google.com/search?q=how+to+calculate+the+work+in+java",
            "code": "assertEquals(1, test.getTrabajo(2,1));"
          },
          {
            "name": "presion",
            "topic": [
              "5d39cc1ffb9370034ec5640c",
              "5d39cc1ffb9370034ec5640b",
              "5d39cc1ffb9370034ec56427"
            ],
            "objective": "Evaluar si el estudiante sabe usar los operadores matemáticos para obtener la presion",
            "grade": 5,
            "successMessage": "Felicidades, sabes usar los operadores matematicos para resolver obtener la presion",
            "successMessageLink": "http://www.google.com/search?q=how+to+make+complex+matemathics+operations+in+java",
            "failureMessage": "Buen intento, no has podido obtener la presion.",
            "failureMessageLink": "http://www.google.com/search?q=how+to+calculate+the+preasure+in+java",
            "code": "assertEquals(6, test.getPresion(2,3));"
          }
        ]
      }
    ]
  }

}
