// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DataLicense is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    struct License {
        address user;
        address company;
        string dataTypes;
        uint256 monthlyPayment;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }
    
    struct User {
        address userAddress;
        string username;
        uint256 totalEarnings;
        bool isRegistered;
    }
    
    Counters.Counter private _licenseIds;
    
    mapping(uint256 => License) public licenses;
    mapping(address => User) public users;
    mapping(address => mapping(address => bool)) public hasAccess;
    mapping(address => uint256[]) public userLicenses;
    mapping(address => uint256[]) public companyLicenses;
    
    event AccessGranted(address indexed user, address indexed company, uint256 licenseId);
    event AccessRevoked(address indexed user, address indexed company, uint256 licenseId);
    event PaymentMade(address indexed user, address indexed company, uint256 amount);
    event UserRegistered(address indexed user, string username);
    
    modifier onlyRegisteredUser() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    constructor() {}
    
    function registerUser(string memory _username) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            userAddress: msg.sender,
            username: _username,
            totalEarnings: 0,
            isRegistered: true
        });
        
        emit UserRegistered(msg.sender, _username);
    }
    
    function grantAccess(
        address _company,
        string memory _dataTypes,
        uint256 _monthlyPayment,
        uint256 _durationMonths
    ) external onlyRegisteredUser {
        require(_company != address(0), "Invalid company address");
        require(_monthlyPayment > 0, "Payment must be greater than 0");
        require(_durationMonths > 0, "Duration must be greater than 0");
        require(!hasAccess[msg.sender][_company], "Access already granted");
        
        _licenseIds.increment();
        uint256 licenseId = _licenseIds.current();
        
        uint256 endTime = block.timestamp + (_durationMonths * 30 days);
        
        licenses[licenseId] = License({
            user: msg.sender,
            company: _company,
            dataTypes: _dataTypes,
            monthlyPayment: _monthlyPayment,
            startTime: block.timestamp,
            endTime: endTime,
            isActive: true
        });
        
        hasAccess[msg.sender][_company] = true;
        userLicenses[msg.sender].push(licenseId);
        companyLicenses[_company].push(licenseId);
        
        emit AccessGranted(msg.sender, _company, licenseId);
    }
    
    function revokeAccess(address _company) external onlyRegisteredUser {
        require(hasAccess[msg.sender][_company], "No access to revoke");
        
        // Find and deactivate the license
        uint256[] memory userLicenseIds = userLicenses[msg.sender];
        for (uint256 i = 0; i < userLicenseIds.length; i++) {
            uint256 licenseId = userLicenseIds[i];
            if (licenses[licenseId].company == _company && licenses[licenseId].isActive) {
                licenses[licenseId].isActive = false;
                licenses[licenseId].endTime = block.timestamp;
                hasAccess[msg.sender][_company] = false;
                
                emit AccessRevoked(msg.sender, _company, licenseId);
                break;
            }
        }
    }
    
    function payUser(address _user, uint256 _amount) external payable nonReentrant {
        require(_user != address(0), "Invalid user address");
        require(_amount > 0, "Amount must be greater than 0");
        require(msg.value >= _amount, "Insufficient payment");
        require(users[_user].isRegistered, "User not registered");
        
        // Update user's total earnings
        users[_user].totalEarnings += _amount;
        
        // Transfer payment to user
        (bool success, ) = payable(_user).call{value: _amount}("");
        require(success, "Payment transfer failed");
        
        // Refund excess payment
        if (msg.value > _amount) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - _amount}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit PaymentMade(_user, msg.sender, _amount);
    }
    
    function getUserLicenses(address _user) external view returns (uint256[] memory) {
        return userLicenses[_user];
    }
    
    function getCompanyLicenses(address _company) external view returns (uint256[] memory) {
        return companyLicenses[_company];
    }
    
    function getLicenseDetails(uint256 _licenseId) external view returns (License memory) {
        return licenses[_licenseId];
    }
    
    function isAccessActive(address _user, address _company) external view returns (bool) {
        if (!hasAccess[_user][_company]) {
            return false;
        }
        
        uint256[] memory userLicenseIds = userLicenses[_user];
        for (uint256 i = 0; i < userLicenseIds.length; i++) {
            uint256 licenseId = userLicenseIds[i];
            License memory license = licenses[licenseId];
            
            if (license.company == _company && 
                license.isActive && 
                block.timestamp <= license.endTime) {
                return true;
            }
        }
        
        return false;
    }
    
    function getUserEarnings(address _user) external view returns (uint256) {
        return users[_user].totalEarnings;
    }
    
    function getTotalLicenses() external view returns (uint256) {
        return _licenseIds.current();
    }
}
