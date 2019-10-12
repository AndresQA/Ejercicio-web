window.addEventListener("load", paginaCargarda);

function paginaCargarda() {
  let contendor = document.querySelector(".contenedor__lista");
  let formulario = document.querySelector(".formulario__producto");

  let numero__llantas = document.querySelector(".numero__llantas");

  formulario.addEventListener("submit", function(e) {
    e.preventDefault();
  });

  let productos = [];

  let marca = document.querySelector(".info__marca");
  let llanta = document.querySelector(".info__llantas");
  let color = document.querySelector(".info__color");
  let agregar = document.querySelector(".info__agregar");

  llanta.addEventListener("input", () => {
    numero__llantas.innerHTML = llanta.value;
  });

  agregar.addEventListener("click", function() {
    let info__marca = "";
    if (marca.value != null) {
      info__marca = marca.value;
    }

    let producto = crearSolicitud(info__marca, llanta.value, color.value);
    if (producto != null) {
      productos.push(producto);
      enviarSolicitud(producto);
    }
  });

  getProductos();

  function getProductos() {
    var promiseGet = fetch("/api/getproductos", {
      method: "GET"
    });

    promiseGet
      .then(response => {
        return response.json();
      })
      .then(response => {
        response.productos.forEach(product => {
          let p = JSON.parse(product.producto);
          let producto = crearSolicitud(
            p.marca,
            p.nLlantas,
            p.color,
            product.id
          );

          producto.view = crearView(producto);
          contendor.append(producto.view);
        });
        console.log("Productos añadidos");
      });
  }

  function enviarSolicitud(producto) {
    formulario.addEventListener("submit", function(e) {
      e.preventDefault();

      var formInfo = new FormData(formulario);
      // agrego esos datos a lo que vamos a enviar
      var data = new URLSearchParams(formInfo);
      data.append("producto", JSON.stringify(producto));
      data.append("fecha", Date.now());
      data.delete("firstname");

      var promiseAdd = fetch("/api/addproductos", {
        method: "POST",
        body: data
      });

      promiseAdd
        .then(response => {
          return response.json();
        })
        .then(response => {
          formulario.reset();

          producto.id = response.producto.id;

          producto.view = crearView(producto);

          contendor.append(producto.view);

          console.log(response);
        });
    });
  }

  function crearSolicitud(marca, nLlantas, color, id) {
    console.log(marca, nLlantas, color, id);
    var admin = null;
    if (marca !== "" && nLlantas != 0) {
      admin = {
        id: id,
        marca: marca,
        nLlantas: nLlantas,
        color: color
      };
    }

    return admin;
  }

  function crearView(producto) {
    let view = document.createElement("div");
    view.className = "item";

    let eliminar = document.createElement("button");
    eliminar.className = "boton";
    eliminar.innerText = "Eliminar";

    eliminar.addEventListener("click", function() {
      let padre = document.querySelector(".contenedor__lista");

      removeProducto(producto.id);
      padre.removeChild(view);
    });

    let editar = document.createElement("button");
    editar.className = "boton";
    editar.innerText = "Editar";

    let confirmar = document.createElement("button");
    confirmar.className = "boton";
    confirmar.innerText = "Confirmar";

    editar.addEventListener("click", () => {
      view.innerHTML = `    
      <div class="item__informacion">
          <div class="item__propiedades">
              <h1>Marca:</h1>
              <input class="input_marca" type="text" placeholder="Ingrese la marca" value="${producto.marca}" />
          </div>
          
          <div class="item__propiedades">
              <h2>Numero de llantas:</h2>
              <div class="view__llantan">
                  <div class="info__viewLlanta">
                      <input class="range info__llantas input_llantas" type="range" max="16" value="${producto.nLlantas}" />
                  </div>
                  <div class="numero__llantas">${producto.nLlantas}</div>
              </div>
          </div>
          <div class="item__propiedades">
              <h2>Color:</h2>
              <input type="color" class="input_color" value="${producto.color}" />
          </div>
      </div>
      <div class="item__acciones">
          
      </div>
`;

      let input_llantas = view.querySelector(".input_llantas");
      input_llantas.addEventListener("input", () => {
        view.querySelector(".numero__llantas").innerHTML = input_llantas.value;
      });

      let itemActions = view.querySelector(".item__acciones");
      itemActions.appendChild(confirmar);
    });

    confirmar.addEventListener("click", () => {
      let input_marca = view.querySelector(".input_marca").value;
      let input_llantas = view.querySelector(".input_llantas").value;
      let input_color = view.querySelector(".input_color").value;

      producto.marca = input_marca;
      producto.nLlantas = input_llantas;
      producto.color = input_color;

      view.innerHTML = `
      <div class="item__informacion">
          <h1>Marca: ${producto.marca}</h1>
          <h2>Numero de llantas: ${producto.nLlantas}</h2>
          <div class="item__color__contenedor">
              <h2>Color: </h2>
              <div class="item__color" style="background:${producto.color}"></div>
          </div>
      </div>
      <div class="item__acciones">
         
      </div>
  
        `;

      let itemActions = view.querySelector(".item__acciones");
      itemActions.appendChild(eliminar);
      itemActions.appendChild(editar);

      putProducto(producto);
    });

    view.innerHTML = `
    <div class="item__informacion">
        <h1>Marca: ${producto.marca}</h1>
        <h2>Numero de llantas: ${producto.nLlantas}</h2>
        <div class="item__color__contenedor">
            <h2>Color: </h2>
            <div class="item__color" style="background:${producto.color}"></div>
        </div>
    </div>
    <div class="item__acciones">
        
    </div>

      `;

    let itemActions = view.querySelector(".item__acciones");
    itemActions.appendChild(eliminar);
    itemActions.appendChild(editar);

    return view;
  }

  function putProducto(producto) {
    var data = new URLSearchParams();
    console.log(producto);

    let product = crearSolicitud(
      producto.marca,
      producto.nLlantas,
      producto.color,
      producto.id
    );
    console.log("crea", product);
    data.append("producto", JSON.stringify(product));

    var promiseRemove = fetch("/api/editarproductos", {
      method: "PUT",
      body: data
    });

    promiseRemove
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log(response.mensaje);
      });
  }

  function removeProducto(id) {
    var data = new URLSearchParams();
    data.append("id", id);

    var promiseRemove = fetch("/api/removeproductos", {
      method: "delete",
      body: data
    });

    promiseRemove
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log(response.mensaje);
      });
  }
}

let view = ``;
