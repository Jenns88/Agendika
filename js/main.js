// Variables
const URL_API = 'https://api.airtable.com/v0/appLqhRIKk95mDdmK/Mis%20contactos';
const AXIOS_CONFIG = {
    headers: {
        'Authorization': 'Bearer keyudTJEM28Q9nbom',
        'Content-Type': 'application/json'
    }
}

var appCrear = new Vue({
    el: '#app-crear',
    data: {
        nombre: '',
        nombreError: false,
        telefono: '',
        telefonoError: false,
        telefonoError2: false,
        email: '',
        notas: '',
        registradoConExito: false,
        registradoLoading: false,
    },
    methods: {
        validar: function () {
            this.nombreError = false;
            this.telefonoError = false;
            this.telefonoError2 = false;
            // Comprobamos que el nombre no este vacio
            this.nombreError = false;
            if (this.nombre === '') {
                this.nombreError = true;
            }
            // Comprobamos que el telefono no este vacio
            this.telefonoError = false;
            if (this.telefono === '') {
                this.telefonoError = true;
            }
            if (isNaN(this.telefono)) {
                this.telefonoError2 = true;
            }
        },
        enviarDatos: function () {
          // No hay errores si se cumplen varias condiciones
          if (!this.nombreError && !this.telefonoError && !this.telefonoError2) {
              // Envio datos del contacto creado
              appCrear.registradoLoading = true;
              axios.post(URL_API, {
                "records": [
                  {
                    "fields": {
                      "Telefono": appCrear.telefono,
                      "Nombre": appCrear.nombre,
                      "E-mail": appCrear.email,
                      "Notas:": appCrear.notas
                    }
                  }
                ]
              }, AXIOS_CONFIG)
              .then(function (response) {
                // Desactiva loading
                appCrear.registradoLoading = false;
                // Muestro el mensaje que indique el éxito
                appCrear.registradoConExito = true;
                // Refresco la informacion
                appBuscador.obtenerDatos();
                // Cambia a una pantalla nueva
                location.href = "index.html"
            })
              .catch(function (error) {
                  console.log(error);
              });
          }
        },
        registrarContacto: function () {
            this.validar();
            this.enviarDatos();
        },
        resetearFormulario: function () {
            // Limpiamos las variables
            this.nombre = '';
            this.telefono = '';
            this.email = '';
            this.notas = ''; 
            // Volvemos a mostrar el formulario
            this.registradoConExito = false; 
        }        
    }
  })  

// BUSCADOR //
var appBuscador = new Vue({
  el: '#app-buscador',
  data: {
      contactos: [],
      ordenar: '',
      buscar: '',
      ficha: undefined
  },
  mounted: function () {
    // Nada mas se dibuje la web, obtengo los datos de la tabla
    this.obtenerDatos();
  },
  computed: {
    contactosOrdenados: function () {
        return this.contactos.map(function (contacto) {
            // Convertimos el JSON a una fecha en unix time
            let tempContacto = contacto;
            tempContacto.createdTime = new Date(contacto.createdTime).getTime()
            return tempContacto
        }).sort(function (a, b) {
            // Ordena nombre
            if (appBuscador.ordenar === 'nombre') {
                return (a.fields.Nombre.toLowerCase() < b.fields.Nombre.toLowerCase()) ? 1 : -1
            // Ordena por fecha de creacion
            } else {
                return a.createdTime - b.createdTime
            }
        
        }).reverse()
    },
    contactosBuscados: function () {
        return this.contactosOrdenados.filter(function (valor) {
            return valor.fields.Nombre.toLowerCase().includes(appBuscador.buscar.toLowerCase())
        })
    }
  },
    methods: {
        obtenerDatos: function () {            
            axios.get(URL_API, AXIOS_CONFIG)
            .then(function (response) {
                appBuscador.contactos = response.data.records;
            })
            .catch(function (error) {
                console.log(error);
            });
        },  
        eliminarDatos: function (contacto) {  
            let that = this          
            axios.delete('https://api.airtable.com/v0/appLqhRIKk95mDdmK/Mis%20contactos/' + contacto.id, AXIOS_CONFIG)
            .then(function (response) {
                console.log('borrado')
                that.obtenerDatos()
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
})