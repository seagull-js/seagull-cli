"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_typescript_1 = require("mocha-typescript");
const path_1 = require("path");
const integration_test_1 = require("../helper/integration_test");
let AwsLambdaIntegrationTest = class AwsLambdaIntegrationTest extends integration_test_1.default {
    'can invoke a function handler'() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addApi('hello', { path: '/hello' });
            this.build();
            const event = {
                httpMethod: 'GET',
                path: '/hello',
                pathParameters: {},
                queryStringParameters: {},
            };
            const file = path_1.join(this.appDir, '.seagull', 'dist', 'api', 'hello.js');
            const api = require(file).handler;
            const response = yield new Promise((resolve, reject) => {
                api(event, null, (error, result) => {
                    error ? reject(error) : resolve(result);
                });
            });
            chai_1.expect(response.body).to.be.equal('hello world');
        });
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AwsLambdaIntegrationTest.prototype, "can invoke a function handler", null);
AwsLambdaIntegrationTest = __decorate([
    mocha_typescript_1.suite.only('Integration::aws_lambda')
], AwsLambdaIntegrationTest);
//# sourceMappingURL=lambda_integration.js.map