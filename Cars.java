/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.libyaguide.framework.modules;

import com.libyaguide.framework.AbstractModule;
import com.libyaguide.framework.App;
import com.libyaguide.framework.servlets.DefaultServlet;
import com.libyaguide.framework.usermanagement.User;
import com.libyaguide.db.*;
import com.libyaguide.framework.Utils;
import com.libyaguide.framework.managers.CarManager;
import com.libyaguide.framework.managers.RateManager;
import com.libyaguide.framework.models.CarModel;
import com.libyaguide.framework.models.UserInformationModel;
import com.libyaguide.framework.models.UserModel;
import com.mongodb.BasicDBObject;
import com.mongodb.Block;
import com.mongodb.DBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javax.servlet.http.HttpSession;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author salem
 */
public class Cars extends AbstractModule {

    public Cars() {
        super("Cars");
    }

    @Override
    public void loadUserSettings(User user, Document settings) {

    }

    @Override
    public String getFuncPrivilege(String func) {
        switch (func) {
            case "getCarInformation":
                return "getCarInformation";
            case "changeCarState":
                return "changeCarState";
            case "getNearstCars":
                return "getNearstCars";
            case "getLoggedInUserCars":
                return "getLoggedInUserCars";
        }
        return null;
    }

    /**
     * Get all driver cars from database
     *
     * @param user an object represents a single user
     * @exception in case there is an issue with data layer
     * @return an set of Cars that associated with the user
     */
    public void getCarInformation(DefaultServlet req) throws Exception {
        String id = req.getParam("carid");
        if (id == null || id.length() > 50) {
            req.jsonData.append("error", 1);
            return;
        }
        CarModel car = null;
        try {
            int cid = Integer.parseInt(id);
            car = new CarModel(cid);

        } catch (NumberFormatException ex) {

            car = new CarModel(new ObjectId(id));
        }

        UserInformationModel info = CarManager.getCarInformation(car);
        if (car.getId() == null) {
            req.jsonData.append("error", 1);
            return;
        }
        double prece = RateManager.getVotes(car);

        Document userinfo = new Document();

        userinfo.append("firstname", info.getFirstname());
        userinfo.append("middlename", info.getMiddlename());
        userinfo.append("lastname", info.getLastname());
        userinfo.append("phonenumber", info.getPhonenumbers());

        userinfo.append("sex", info.getSex());
        userinfo.append("userid", info.getUser().getId());

        req.jsonData.append("userInfo", userinfo);

        req.jsonData.append("carid", info.getUserCars().get(0).getId());
        req.jsonData.append("devno", info.getUserCars().get(0).getDeviceNo());

        req.jsonData.append("car_brand", info.getUserCars().get(0).getCarName());
        req.jsonData.append("car_type", info.getUserCars().get(0).getCarType());

        req.jsonData.append("stars", Utils.reate(prece));
        req.jsonData.append("num_of_voters", RateManager.getVotesCount(car));
        req.jsonData.append("seatsno", info.getUserCars().get(0).getseatsNumber());
        req.jsonData.append("is_available", info.getUserCars().get(0).isAvailable());

    }

    public void changeCarState(DefaultServlet req) throws Exception {
        String id = req.getParam("carid");
        String state = req.getParam("state");
        CarModel car = new CarModel(new ObjectId(id));
        car.isAvailable(Boolean.parseBoolean(state));
        UserInformationModel info = new UserInformationModel();
        int uid = Integer.parseInt(req.user.getNo() + "");
        UserModel user = new UserModel(uid);
        info.setUser(user);
        ArrayList<CarModel> cars = new ArrayList<>();
        cars.add(car);
        info.setUserCars(cars);
        CarManager.changeCarState(info);
        req.jsonData.append("ok", 1);
    }

    public void getNearstCars(DefaultServlet req) throws Exception {
        String x = req.getParam("x");
        String y = req.getParam("y");
        String type = req.getParam("type");

        if (x == null || y == null) {
            req.jsonData.append("error", 1);
            return;
        }

        if (type == null) {
            req.jsonData.append("error", 1);
            return;
        }

        ArrayList<CarModel> carset = CarManager.getNearestCarsDevice(Double.parseDouble(x), Double.parseDouble(y));
        Iterator<CarModel> a = carset.iterator();
        ArrayList responseBody = new ArrayList();
        Document data = null;
        while (a.hasNext()) {
            CarModel car = a.next();

            if (type.equals("list") == false) {
                data = new Document();
                data.append("car_location", new JSONObject().put("coordinates", car.getCoordinates()));

                data.append("carNo", car.getDeviceNo());
                responseBody.add(data);
            } else {
                UserInformationModel info = CarManager.getCarInformation(car);
                if (info == null || info.getUserCars().get(0).isAvailable() == false) {

                } else {
                    data = new Document();
                    data.append("id", info.getUserCars().get(0).getId());
                    data.append("devid", info.getUserCars().get(0).getDeviceNo());

                    data.append("seats_num", info.getUserCars().get(0).getseatsNumber());
                    data.append("car_name", info.getUserCars().get(0).getCarName());
                    data.append("car_model", info.getUserCars().get(0).getCarType());
                    data.append("user_id", info.getUser().getId());
                    data.append("driver_name", info.getFirstname() + " " + info.getLastname());
                    data.append("distenation", ((int) info.getUserCars().get(0).getDestination()));
                    double prece = RateManager.getVotes(car);
                    data.append("stars", Utils.reate(prece));
                    responseBody.add(data);
                }
            }

        }
        req.jsonData.append("results", responseBody);

    }

    public void getLoggedInUserCars(DefaultServlet req) throws Exception {
        int id = Integer.parseInt("171");//req.user.getNo() + "");
        UserModel user = new UserModel(id);
        ArrayList<CarModel> cars = CarManager.getUserCars(user);
        if (cars == null) {

            req.jsonData.append("error", 2);
            return;
        }

        ArrayList set = new ArrayList();
        for (CarModel car : cars) {

            Document data = new Document();
            data.append("id", car.getId());
            data.append("car_name", car.getCarName());
            data.append("car_type", car.getCarType());
            data.append("is_available", car.isAvailable());
            set.add(data);
        }
        req.jsonData.append("res", set);

    }

    @Override
    public boolean handleRequest(DefaultServlet req) throws Exception {
        switch (req.FUNC_NO) {
            case "getCarInformation":
                this.getCarInformation(req);
                break;
            case "changeCarState":
                this.changeCarState(req);
                break;
            case "getNearstCars":
                this.getNearstCars(req);
                break;
            case "getLoggedInUserCars":
                this.getLoggedInUserCars(req);
                break;
            default:
                return false;
        }
        return true;
    }

}
