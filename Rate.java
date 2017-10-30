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
import com.libyaguide.framework.managers.RequestRideManager;
import com.libyaguide.framework.models.CarModel;
import com.libyaguide.framework.models.RequestRideModel;
import com.libyaguide.framework.models.UserInformationModel;
import com.libyaguide.framework.models.UserModel;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONArray;

/**
 *
 * @author salem
 */
public class Rate extends AbstractModule {

    public Rate() {
        super("Rate");
    }

    @Override
    public void loadUserSettings(User user, Document settings) {

    }

    @Override
    public String getFuncPrivilege(String func) {
        switch (func) {
            case "getQuestions":
                return "getQuestions";
            case "rate":
                return "rate";
        }
        return null;
    }

    public void getQuestions(DefaultServlet req) throws Exception {
        String type = req.getParam("type");

        ArrayList question = RateManager.getQuestions(type);
        if (question == null) {
            req.jsonData.append("error", 2);
            return;
        }

        req.jsonData.append("results", question);

    }

    public void rate(DefaultServlet req) throws Exception {
        String requestid = req.getParam("requestid");
        String ratesset = req.getParam("rates");
        String note = req.getParam("note");

        if (ratesset == null) {
            req.jsonData.append("error", 1);
            return;
        }
        JSONArray rates = new JSONArray(ratesset);
        if (rates.length() > 10) {
            req.jsonData.append("error", 1);
            return;
        }
        LinkedHashSet<ObjectId> set = new LinkedHashSet();
        for (int i = 0; i < rates.length(); i++) {
            if (rates.getJSONObject(i).getInt("stars") > 0 && rates.getJSONObject(i).getInt("stars") <= 5) {
                set.add(new ObjectId(rates.getJSONObject(i).getString("qid")));
            }
        }
        if (set.size() != rates.length()) {
            req.jsonData.append("error", 1);
            return;
        }

        if (requestid == null || requestid.length() > 50) {
            req.jsonData.append("error", 1);
            return;
        }

        if (note == null || note.length() > 150) {
            req.jsonData.append("error", 1);
            return;
        }

        int id = Integer.parseInt(req.user.getNo() + "");
        UserModel user = new UserModel(id);
        RequestRideModel requst = new RequestRideModel(new ObjectId(requestid));
        RequestRideManager.getRequestInformation(requst);
        if (requst.getClosedBy() == null) {
            req.jsonData.append("error", 1);
            return;
        }

        /* if (DatabaseManager.isRequestValid(req) == false) {
                res.put("error", 4);
                response.getWriter().write(res.toString());
                return;
            }*/
        ArrayList<Document> list = new ArrayList();
        for (int i = 0; i < rates.length(); i++) {
            list.add(new Document().append("qid", new ObjectId(rates.getJSONObject(i).getString("qid"))).append("stars", rates.getJSONObject(i).getString("stars")));

        }
        RateManager.rateRide(user, list, note, requst);

        req.jsonData.append("ok", 1);
    }

    @Override
    public boolean handleRequest(DefaultServlet req) throws Exception {
        switch (req.FUNC_NO) {
            case "getQuestions":
                this.getQuestions(req);
                break;
            case "rate":
                this.rate(req);
                break;
            default:
                return false;
        }
        return true;
    }

}
