#!/usr/bin/env node

/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2015, Nicolas Riesco and others as credited in the AUTHORS file
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 */

module.exports = VMSession;

var vm = require("vm");

/**
 * Class to handle a VM session that defines global.
 *
 * @constructor
 */
function VMSession() {
    this.context = vm.createContext(global);
    require.main = undefined;
    require.cache = {};
    this.context.require = require;

    this.executionCount = 0;
    this.result = null;
}

/**
 * Run a task.
 *
 * @param {string} code - code to run
 * @param {callback} beforeRun - callback to be run before the code
 * @param {callback} afterRun - callback to be run after the code
 * @param {callback} onSuccess - callback that handles the output
 * @param {callback} onError - callback that handles errors
 */
VMSession.prototype.run = function(code, beforeRun, afterRun, onSuccess, onError) {
    this.executionCount++;
    beforeRun(this);

    try {
        this.result = vm.runInContext(code, this.context);
        onSuccess(this);
    } catch (e) {
        this.result = e;
        onError(this);
    }

    afterRun(this);
};