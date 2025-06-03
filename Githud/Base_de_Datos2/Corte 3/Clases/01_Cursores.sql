--Cursores
--Apuntadores solo lectura a un conjunto de datos - Por medio de una consula
--Resultset  | Recordset

--Permiten procesar la informacion 1 a 1
--Se declaran con una consulta con parametro o sin parametros
--Se debe usar un conjunto de comandos

--SINTAXIS
begin
    declare
        nombrecursor refcursor;
        nombrecursor CURSOR[(argumentos)]for query
    open
    fetch
        --Sentencias
    commit
    rollback
end

--Ejemplo (1)
do
$$
declare
    reg_user users%ROWTYPE;
    cur_user CURSOR FOR select * from users where country = 'Colombia';
begin
    open cur_user;
        fetch cur_user into reg_user;
        raise notice 'El usuario % es de % :', reg_user.id , reg_user.country
        fetch cur_user into reg_user;
        raise notice 'El usuario % es de % :', reg_user.id , reg_user.country
    close cur_user;
end;
$$ language plpgsql;

--Ejemplo (2) WHILE
--do
--$$
--declare
--    reg_user users%ROWTYPE;
--    cur_user CURSOR FOR select * from users where country = 'Colombia';
--begin
--    open cur_user;
--        fetch cur_user into reg_user;
--        while(FOUND) loop
--            raise notice 'El usuario % es de % :', reg_user.id , reg_user.country
--        end loop;
--    close cur_user;
--end;
--$$language plpgsql;

--[<<Label>>]
--FOR registro IN cursor1[(argumentos)] loop
--comandos sql
--end loop

--Implicitos = no declarar variable rowtype
--Explicitos = Variable que almacena una consulta o mas


--Ejemplo (3) 
do
$$
declare
    reg_user users%ROWTYPE;
    cur_user CURSOR FOR select * from users where country = 'Colombia';
begin
    raise notice 'Inicio la iteracion';
    for reg_user in cur_user loop
        raise notice'El usuario es %',reg_user;
    end loop
    raise notice 'Fin de la iteracion';
end;
$$ language plpgsql;

--Ejemplo (4) Implicito
do
$$
declare
    reg_user users%ROWTYPE;
begin
    raise notice 'Inicio la iteracion';
    for reg_user in select * from users where country = 'Colombia'; loop
        raise notice'El usuario es %',reg_user;
    end loop
    raise notice 'Fin de la iteracion';
end;
$$ language plpgsql;

--Ejemplo (5) Explicito con argumentos
do
$$
declare
    reg_user users%ROWTYPE;
    cur_user CURSOR(filtro VARCHAR)FOR select * from users where country = filtro;
    filtro VARCHAR := 'Peru';
begin
    raise notice 'Inicio la iteracion';
    for reg_user in cur_user(filtro) loop
        raise notice'El usuario es %',reg_user;
    end loop
    raise notice 'Fin de la iteracion';
end;
$$ language plpgsql;

