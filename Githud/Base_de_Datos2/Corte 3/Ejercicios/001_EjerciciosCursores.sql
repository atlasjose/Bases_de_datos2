--Ejercicio (1)
--Imprimir por medio de un cursor todas las tareas que tengan prioridad baja 
--Hacer una de modo Implicito y otra explicito digitando la prioridad 

--Version Explicita 
DO
$$
DECLARE
    reg_task tasks%ROWTYPE;
    cur_task CURSOR FOR SELECT t.* FROM tasks t JOIN priorities p ON t.pid = p.pid WHERE p.p_name = 'baja'; 
BEGIN
    RAISE NOTICE 'Inicio de la iteración';
    FOR reg_task IN cur_task LOOP
        RAISE NOTICE 'Tarea: % Título: % Estado: %', reg_task.tid, reg_task.title, reg_task.status;
    END LOOP;
    RAISE NOTICE 'Fin de la iteración';
END;
$$ LANGUAGE plpgsql;

-- Versión Implícita

DO
$$
DECLARE
    reg_task tasks%ROWTYPE;
    filtro VARCHAR := 'baja';  
    CURSOR cur_task(fil VARCHAR) IS SELECT t.* FROM tasks t JOIN priorities p ON t.pid = p.pid WHERE p.p_name = fil;
BEGIN
    RAISE NOTICE 'Inicio de la iteracion : %';
    FOR reg_task IN cur_task(filtro) LOOP
        RAISE NOTICE 'Tarea: % Título % Estado %', reg_task.tid, reg_task.title, reg_task.status;
    END LOOP;
    RAISE NOTICE 'Fin de la iteración';
END;
$$ LANGUAGE plpgsql;
