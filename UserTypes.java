/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.libyaguide.framework.usermanagement;

/**
 *
 * @author basem
 */
public enum UserTypes {
    
    UNKNOWN(0),
    ADMINISTRATOR (1),
    EMPLOYEE (2),
    DISTRIBUTER (3),
    INSTALLATION (4),
    SUB_USER (5),
    DEMO (6),
    TEST (7),
    GROUP (8),
    CUSTOMER_INDIVIDUAL (100),
    CUSTOMER_COMPANY (101),
    DRIVER (2001),
    RIDER (2002);

    private final int val;

    UserTypes(int val){
        this.val = val;
    }

    public int val() {
        return val;
    }
    
    public static UserTypes valueOf(int val){
        switch(val){
            case 1: return UserTypes.ADMINISTRATOR;
            case 2: return UserTypes.EMPLOYEE;
            case 3: return UserTypes.DISTRIBUTER;
            case 4: return UserTypes.INSTALLATION;
            case 5: return UserTypes.SUB_USER;
            case 6: return UserTypes.DEMO;
            case 7: return UserTypes.TEST;
            case 100: return UserTypes.CUSTOMER_INDIVIDUAL;
            case 101: return UserTypes.CUSTOMER_COMPANY;
            case 2001: return UserTypes.DRIVER;
           case 2002: return UserTypes.RIDER;
            default: return UserTypes.UNKNOWN;
        }
    }
    
}
