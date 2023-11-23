* [33m845dcf0[m[33m ([m[1;36mHEAD -> [m[1;32mmain[m[33m, [m[1;31morigin/dev[m[33m, [m[1;32mdev[m[33m)[m [Fix] Error en filtro avanzado luego de las trasnferencias
* [33mc343646[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m [Add] Controlador para obtener las transacciones por categoria
* [33mdbc7870[m [Add] Paginacion en transacciones
* [33m4dd3d89[m [Update] Se ordenan las categorias por nombre
* [33m169f4ca[m [Add] Endpoint para obtener las transacciones por id de la cuenta
* [33m0919b53[m [Fix] Solucion de error al logearse cuando se tiene una foto de perfil
* [33m01b8ce3[m [Update] Se permitio el acceso desde el subdominio en el que se aloja el frontend
* [33mf9642a9[m[33m ([m[1;31morigin/transfer[m[33m)[m Se creo controlador para eliminar todas las transacciones de una categoria
*   [33ma28ecd7[m Merge branch 'transfer' of https://github.com/anderlfrias/personal-finance.api into transfer
[32m|[m[33m\[m  
[32m|[m * [33mdf01de5[m Populate de las nuevas propiedades necesarias para la transaccion
[32m|[m * [33m777bc1d[m Modulo de tranferencia, listo
[32m|[m * [33m65506b0[m Minimal changes
[32m|[m * [33ma3481a9[m Rama para transferencias entre cuentas
* [33m|[m [33mf832191[m Modulo de transferencia entre cuentas, listo
* [33m|[m [33m6d8dcc4[m Creacion de endpoint para transferencias
[33m|[m[33m/[m  
* [33ma82f176[m Se agrego la url de la app en produccion a los cors
* [33mb0b3286[m Cambio del puerto
* [33m770cc01[m Se libero endpoint de bienvenida
* [33m2d09c21[m Cambio de puerto
* [33mbf920cd[m Configuracion del ecosistema
* [33mb1da9ba[m Error de busqueda solucionado
* [33m6d432c9[m Cors
* [33m5ed3c52[m Se agrega imagen de perfil
* [33mf992223[m Controlador para obtener el total de la data de los usuarios
* [33m0e072e5[m Envio de correo de para resetear contraseña, listo
* [33m85b4b4d[m Controlador de recuperar contraseña, iniciado
* [33m47c9d2a[m Se creo el endpoint de cambiar contraseña. Aun no provado
* [33m37bb481[m Confirmacion de email mejorada
* [33mc9f4568[m Limpieza del codigo
* [33md3d4472[m Confirmacion de correo electronico, listo
* [33mbad7f72[m Paginacion en transacciones y controlador para los graficos de ingresos y gastos por categorias
* [33m35e2ddf[m Se ignoran las mayusculas a la hora de hacer el filtro en Transacciones
* [33ma7cce04[m Controlador de grafico general, listo
* [33mfdcbf9c[m ...
* [33m833e0de[m Controlador de estadisticas, listo
* [33m3df829b[m Prueba 1 del controlador de stadisticas
* [33m8fb7aca[m Se creo el controlador de Estadisticas
* [33mf0d124b[m Solucion de error al crear transacciones sin categoria
* [33mbe0bd1c[m Solucion de error al editar y crear transacciones
* [33m9265ea7[m Solucion de error al intentar eliminar transaccion
* [33m683d77b[m Se creo la politica para verificar que el usuario este logeado
* [33m35b9cb0[m Se ordenaron los presupuestos por fecha de finalizacion
* [33m1e47d20[m Se agrego la opcion de podre obtener solo los presupuestos activos
* [33m0d7f529[m Edicion de los cors
* [33m797e54c[m Solucion de error en la validacion de las credenciales del usuario al logearse
* [33m8dcf602[m Modificacion en la estructura del modelo de Wallet para crear las wallets por defecto en 0.0 de balance
* [33m28bc13f[m Solucion de error presente al intentar crear Presupuestos
* [33mc96fc3f[m Se elimino el campo 'descripcion' del modelo Presupuesto
* [33m29799bf[m Controlador de presupuesto, editado y adaptado a nueva estructura
* [33m12a6f9e[m Se agrego relacion de uno a muchos en los modelos de presupuesto y transaccion
* [33m8605acb[m Mejora del filtro en las transacciones
* [33m7cafbba[m Se creo enpoint para obtener el balance total actual del usuario
* [33md851bfa[m MessageCode agregado para el manejo de los mansajes de error
* [33m6bca71d[m Se ordenas por fecha las transacciones
* [33m3ebfe74[m Filtro en transacciones, listo
* [33mc8bfc8a[m Se creo relacion entre usuario y transaccion
* [33me3eb46a[m Se creo relacion entre usuario y transaccion
* [33m61f80e3[m Solucion de problemas al intentar crear wallet
* [33m84a967e[m Solucion del problema relacionado con los cors
* [33mc174ea4[m Validaciones en el controlador de usuarios
* [33mfb6ef48[m minimal changes
* [33m7255432[m CRUD y rutas de presupuesto, listo
* [33m684aead[m Modelo de presupuesto, listo
* [33m8a56074[m Modificacion del endpoint de login en el controlador de usuarios
* [33mf00a942[m Actualizacion de los CORS para permitir peticiones desde cualquier origen
* [33m9371ceb[m CRUD de transaction completado
* [33m44504ae[m Contralador para crear transacciones, listo
* [33m3c9fc91[m CRUD de categorias, listo
*   [33m83ed965[m Merge branch 'main' of https://github.com/anderlfrias/wallet-adm.api
[34m|[m[35m\[m  
[34m|[m * [33mb422f3b[m Modelo de Categoria, creado
[34m|[m * [33m45e6cc8[m Update README.md
* [35m|[m [33mf586faf[m CRUD de categorias, listo
* [35m|[m [33mf04900e[m CRUD de Wallet, listo
* [35m|[m [33m9a249e8[m Login listo
* [35m|[m [33m7e1d987[m Modelo Transaction, listo
* [35m|[m [33m1344229[m Creacion del modelo de categorias
[35m|[m[35m/[m  
* [33md91d294[m feat: Controlador de usuarios, listo
* [33m82e2e2c[m perf: Se eliminaron de archivos inncesarios
* [33m7b9a892[m feat: Controlador Wallet creado
* [33m49502dc[m feat: Controlador User creado
* [33m977f8b0[m feat: Controlador Home creado
* [33m233fac9[m First commit
