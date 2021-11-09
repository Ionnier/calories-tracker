drop view if exists Tracker;
drop table if exists Consumed;
drop table if exists Activity;
drop view if exists All_Products;
drop table if exists Product_Ingredients;
drop table if exists Products;
drop table if exists Users;
create table Users(
	id_user serial primary key,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	email varchar(320) not null unique,
	password varchar(40) not null,
	created_on TIMESTAMP default now()
);

create table Products(
	id_product serial primary key,
	product_name varchar(100) unique not null,
	unit varchar(10) not null,
	no_units real,
	calories real,
	proteins real,
	carbohydrates real,
	sugars real,
	fats real,
	saturated_fats real,
	fibers real,
	salt real
);

create table Product_Ingredients(
	id_product integer references Products(id_product) on delete cascade,
	id_ingredient integer references Products(id_product) on delete cascade,
	no_units integer not null
);
create or replace view All_Products as (
						select id_product,product_name,unit,
							  coalesce(no_units, (select round(sum(no_units))
							   					  from Product_Ingredients pi
							   					  where pi.id_product=p.id_product)  
							   ) as "no_units",
							   coalesce(calories, (select round(sum((prod.calories/prod.no_units)*pi.no_units))
							   					  from Product_Ingredients pi 
							   					  join Products prod on pi.id_ingredient = prod.id_product 
							   					  where pi.id_product=p.id_product)  
							   ) as "calories"
							   ,
							   coalesce(proteins, (select round(sum((prod.proteins/prod.no_units)*pi.no_units))
							   					  from Product_Ingredients pi 
							   					  join Products prod on pi.id_ingredient = prod.id_product 
							   					  where pi.id_product=p.id_product)  
							   ) as "proteins",
							   coalesce(carbohydrates, (select round(sum((prod.carbohydrates/prod.no_units)*pi.no_units))
							   					  from Product_Ingredients pi 
							   					  join Products prod on pi.id_ingredient = prod.id_product 
							   					  where pi.id_product=p.id_product)  
							   ) as "carbohydrates",
							   coalesce(sugars, (select round(sum((prod.sugars/prod.no_units)*pi.no_units))
							   					  from Product_Ingredients pi 
							   					  join Products prod on pi.id_ingredient = prod.id_product 
							   					  where pi.id_product=p.id_product)  
							   ) as "sugars",
							   coalesce(fats, (select round(sum((prod.fats/prod.no_units)*pi.no_units))
							   					  from Product_Ingredients pi 
							   					  join Products prod on pi.id_ingredient = prod.id_product 
							   					  where pi.id_product=p.id_product)  
							   ) as "fats",
							   coalesce(saturated_fats, (select round(sum((prod.saturated_fats/prod.no_units)*pi.no_units))
							   					  from Product_Ingredients pi 
							   					  join Products prod on pi.id_ingredient = prod.id_product 
							   					  where pi.id_product=p.id_product)  
							   ) as "saturated_fats",
							   coalesce(fibers, (select round(sum((prod.fibers/prod.no_units)*pi.no_units))
							   					  from Product_Ingredients pi 
							   					  join Products prod on pi.id_ingredient = prod.id_product 
							   					  where pi.id_product=p.id_product)  
							   ) as "fibers",
							   coalesce(salt, (select round(sum((prod.salt/prod.no_units)*pi.no_units))
							   					  from Product_Ingredients pi 
							   					  join Products prod on pi.id_ingredient = prod.id_product 
							   					  where pi.id_product=p.id_product)  
							   ) as "salt" 
						from Products p
					);
create table Consumed(
	id_user integer references Users(id_user) on delete cascade,
	id_product integer references Products(id_product) on delete cascade,
	no_consumed real not null check(no_consumed>0),
	consumed_on TIMESTAMP default now()
);
create table Activity(
	id_user integer references Users(id_user) on delete cascade,
	activity_name varchar(100) not null,
	calories_consumed real not null,
	duration real,
	performed_on TIMESTAMP default now()
);

 create or replace view Tracker as (
 select id_user,ap.product_name as "name", (ap.calories/ap.no_units)*c.no_consumed as "calories", consumed_on as "on" 
 from Consumed c
 join all_products ap using(id_product) 
 union
 select id_user, activity_name as "name", (-1) * calories_consumed as "calories", performed_on as  "on" from activity a 
 order by "on" desc);

insert into Users(first_name,last_name,email,password) values('Dragos','Bahrim','dragosbahrim@outlook.com','example');
insert into Products(product_name,unit,no_units,calories,proteins,fats,carbohydrates,salt,fibers,sugars) 
						values('Malai Grisat Enache','g',100,368,8.7,2,76.6,0,0,0);
insert into Products(product_name,unit,no_units,calories,fats,saturated_fats,salt,carbohydrates,fibers,sugars,proteins) 
						values('Branza de vaci','g',100,402,33,21,0.621,1.3,0,0,25);
insert into Products(product_name,unit) values ('Mamaliga cu branza de vaci','g');
insert into Product_Ingredients(id_product,id_ingredient,no_units) values(3,1,100),(3,2,100);