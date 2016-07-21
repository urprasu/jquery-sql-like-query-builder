$(document).ready(function() {
    function addQuery(el) {
        var template_query = $('#template-query').html()

        $(el).parents('.js-sub-query').first().find('.js-sub-query-content').append(template_query)
    }

    function addSubQuery(el) {
        var template_subquery = $('#template-subquery').html()

        $(el).parents('.js-sub-query').first().find('.js-sub-query-content').append(template_subquery)

        // $(el).find('.js-add').last().trigger('click')
    }

    function removeQuery(el) {
        $(el).parents('.js-query').first().remove()
    }

    function removeSubQuery(el) {
        $(el).parents('.js-sub-query').first().remove()
    }


    function getCondition(el) {
        var q = {},
            column, operator, value

        q.operator = $(el).find('td.separator option:selected').first().val()
        q.expressions = []

        $(el).find('td.query').first().children().each(function(i, child) {
            if ($(child).hasClass('js-query')) {
                column = $(child).find('.col :selected').text()
                operator = $(child).find('.op :selected').val()
                value = $(child).find('input').val()
                q.expressions.push([column, operator, value])
            } else {
                q.expressions.push(getCondition($(child)))
            }
        })

        return q
    }

    function getQuery(condition) {
        var query = '',
            tmp = [], i

        if (condition.expressions.length == 1) {
            return buildExpression(condition.expressions[0])
        } else {
            for (i = 0 ; i < condition.expressions.length ; i++) {
                if (_.isArray(condition.expressions[i])) {
                    tmp.push(buildExpression(condition.expressions[i]))
                } else {
                    tmp.push(getQuery(condition.expressions[i]))
                }
            }

            return '(' + tmp.join(' ' + condition.operator + ' ') + ')'
        }
    }

    function buildExpression(expression) {
        return '("{0}" {1} "{2}")'
            .replace('{0}', expression[0])
            .replace('{1}', expression[1])
            .replace('{2}', expression[2])
    }

    $('body').on('click', '.js-add', function(e) {
        addQuery($(this))

        e.preventDefault()
        e.stopPropagation()
    })

    $('body').on('click', '.js-add-subquery', function(e) {
        addSubQuery($(this))

        e.preventDefault()
        e.stopPropagation()
    })

    $('body').on('click', '.js-remove', function(e) {
        removeQuery($(this))

        e.preventDefault()
        e.stopPropagation()
    })

    $('body').on('click', '.js-remove-subquery', function(e) {
        removeSubQuery($(this))

        e.preventDefault()
        e.stopPropagation()
    })

    $('body').on('click', '#btnCondition', function() {
        var query = getCondition($(el).find('table.js-subquery').first())
        alert(JSON.stringify(query))
        console.log(query)
    })

    $('body').on('click', '#btnQuery', function() {
        var con = getQuery(getCondition($(el).find('table.js-subquery').first()))
        alert(con)
        console.log(con)
    })

    var template_subquery = $('#template-subquery').html()

    $('.js-query-root').append(template_subquery)
})
